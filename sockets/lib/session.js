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
  JOINED: 'joined'
}

/**
 * Check a value is within bounds.
 */
function within (value, lower, upper) {
  return value > lower && value < upper
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
Session.prototype.emitPlayState = function (currentSocket) {
  this.all().forEach(function (socket) {
    // Enable skipping a passed in socket.
    if (currentSocket === socket) {
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
      if (socket === currentSocket) {
        return false
      }

      // Set as waiting when no ready state has been received.
      return this.getReadyState(socket) === READY_STATE.WAITING
    }, this)
    .length
}

/**
 * Get the common status between users.
 */
Session.prototype.getPlayState = function (socket) {
  const readyState = this.getReadyState(socket)

  // Set waiting sockets to the default state.
  if (readyState === READY_STATE.WAITING) {
    return this.playState
  }

  // If other sockets are waiting, paused the current socket.
  return this.getWaiting(socket) ? false : this.playState
}

/**
 * Handle updates in the session state.
 */
Session.prototype.setState = function (socket, state) {
  // Emit joined state to other sockets.
  if (state.ready === READY_STATE.JOINED) {
    this.lastKnownSource = socket.id
    this.emitPlayState(socket)

    return
  }

  // Track whether we need to update other clients on the change. The time
  // needs to be within bounds because the video client is 100% accurate.
  var timeChanged = !within(this.getTime(), state.time - 200, state.time + 200)
  var playStateChanged = this.getPlayState(socket) !== state.play
  var readyStateChanged = this.getReadyState(socket) !== state.ready

  debug('set state', socket.id, state)

  // Update state when things have changed.
  if (!timeChanged && !playStateChanged && !readyStateChanged) {
    return
  }

  // Update the current socket state.
  this.readyStates[socket.id] = state.ready

  // Emit the current state back to the socket when change is invalid.
  if (this.getWaiting(socket)) {
    if (playStateChanged) {
      this.emitState(socket)
    }

    return
  }

  // Update global state data.
  this.playState = state.play
  this.lastKnownTime = state.time
  this.lastKnownTimestamp = Date.now()
  this.lastKnownSource = socket.id

  this.emitPlayState()
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
  return socket && this.readyStates[socket.id]
}

/**
 * Join the session.
 */
Session.prototype.join = function (socket, cb) {
  var time = this.getTime()

  // Add the socket after getting the current time.
  this.sockets[socket.id] = socket

  // Set the initial socket state to pause other clients.
  this.setState(socket, { ready: READY_STATE.JOINED })

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
