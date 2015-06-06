var uuid = require('uuid')
var debug = require('debug')('back-row:session')
var extend = require('xtend')

/**
 * Expose the session constructor.
 */
module.exports = Session

/**
 * The default playback position.
 */
var DEFAULT_PLAY_STATE = false

/**
 * Store possible session states.
 */
var READY_STATE = {
  READY: 'ready',
  WAITING: 'waiting',
  ENDED: 'ended',
  SEEKING: 'seeking'
}

/**
 * Create a session handler.
 */
function Session (options) {
  this.id = uuid.v4()

  this.playState = DEFAULT_PLAY_STATE
  this.sockets = {}
  this.readyStates = {}
  this.options = options

  this.lastKnownTime = 0
  this.lastKnownSource = undefined
  this.lastKnownTimestamp = Date.now()
}

/**
 * Emit state to a socket instance.
 */
Session.prototype.emitState = function (socket) {
  var state = this.getState(socket)

  debug('emit state', socket.id, state)

  socket.emit('state', this.id, state)
}

/**
 * Emit the current state to all sockets.
 */
Session.prototype.emitPlayState = function (currentSocket, currentPlayState) {
  // Emit new play state to all available sockets.
  this.all().forEach(function (socket) {
    // Ensure the current play state is correct. This blocks clients from
    // playing when it should be waiting.
    if (currentSocket.id === socket.id && this.getPlayState(socket) === currentPlayState) {
      return
    }

    this.emitState(socket)
  }, this)
}

/**
 * Check if we have waiting sockets.
 */
Session.prototype.getWaiting = function (currentSocket) {
  return this.all()
    .filter(function (socket) {
      const readyState = this.getReadyState(socket)

      // Set as waiting when no ready state has been recieved.
      return socket !== currentSocket &&
        (!readyState || readyState === READY_STATE.WAITING)
    }, this)
    .length
}

/**
 * Get the common status between users.
 */
Session.prototype.getPlayState = function (socket) {
  return this.getWaiting(socket) ? false : this.playState
}

/**
 * Handle updates in the session state.
 */
Session.prototype.setState = function (socket, state) {
  // Track whether we need to update other clients on the change.
  var updated = false

  debug('set state', socket.id, state)

  // Update ready state before we emit anything.
  if (this.readyStates[socket.id] !== state.ready) {
    this.readyStates[socket.id] = state.ready
    this.lastKnownSource = socket.id

    updated = true
  }

  // Update the play state when not waiting.
  if (!this.getWaiting(socket) && this.playState !== state.play) {
    this.playState = state.play
    this.lastKnownSource = socket.id

    updated = true
  }

  // Update the timestamp when changing.
  this.lastKnownTime = state.time
  this.lastKnownTimestamp = Date.now()

  if (updated) {
    this.emitPlayState(socket, state.play)
  }
}

/**
 * Update session options.
 */
Session.prototype.setOptions = function (socket, options) {
  this.options = options

  debug('set options', socket.id, options)

  this.emit('options', this.id, options)
}

/**
 * Calculate the current time.
 */
Session.prototype.getTime = function () {
  if (this.getPlayState() !== true) {
    return this.lastKnownTime
  }

  return this.lastKnownTime + (Date.now() - this.lastKnownTimestamp)
}

/**
 * Get the current session playback state.
 */
Session.prototype.getState = function (currentSocket) {
  return {
    play: this.getPlayState(currentSocket),
    ready: this.getReadyState(currentSocket),
    time: this.getTime(),
    waiting: this.getWaiting(currentSocket),
    timestamp: Date.now(),
    peers: Object.keys(this.sockets).filter(function (id) { return id !== currentSocket.id }),
    source: this.lastKnownSource
  }
}

/**
 * Get the current session options.
 */
Session.prototype.getOptions = function () {
  return this.options
}

/**
 * Return an array of user sockets.
 */
Session.prototype.all = function () {
  return Object.keys(this.sockets).map(function (key) {
    return this.sockets[key]
  }, this)
}

/**
 * Get data by id.
 */
Session.prototype.getReadyState = function (socket) {
  return this.readyStates[socket.id]
}

/**
 * Join the session.
 */
Session.prototype.join = function (socket, cb) {
  var time = this.getTime()

  // Add the socket after getting the current time.
  this.sockets[socket.id] = socket

  // Set the initial socket state to pause other clients.
  this.setState(socket, {
    play: this.playState,
    time: time
  })

  // Send set up state back to the client.
  cb(this.id, {
    state: extend(this.getState(socket), { play: this.playState }),
    options: this.getOptions()
  })
}

/**
 * Remove a socket from the session.
 */
Session.prototype.leave = function (socket) {
  var socket = this.sockets[socket && socket.id]

  if (socket) {
    delete this.sockets[socket.id]
    delete this.readyStates[socket.id]

    // Reset playback if no one is watching.
    if (this.all().length === 0) {
      this.playState = DEFAULT_PLAY_STATE
      this.lastKnownTime = this.getTime()
      this.lastKnownSource = undefined
      this.lastKnownTimestamp = Date.now()
    }

    // Update state when leaving on "ready" mode.
    this.emitPlayState(socket)
  }
}

/**
 * Emit an event to all the sockets.
 */
Session.prototype.emit = function () {
  var args = arguments

  this.all().forEach(function (socket) {
    socket.emit.apply(socket, args)
  })
}

/**
 * Kill the current session.
 */
Session.prototype.destroy = function () {
  this.all().forEach(function (socket) {
    this.leave(socket)
  })
}
