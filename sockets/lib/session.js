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
 * Keep time accuracy between clients.
 */
var TIME_ACCURACY = 50

/**
 * Store possible session states.
 */
var READY_STATE = {
  READY: 'ready',
  WAITING: 'waiting',
  JOINED: 'joined'
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
Session.prototype.emitStateAll = function (currentSocket) {
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
      return this.getReadyState(socket) !== READY_STATE.READY
    }, this)
    .length
}

/**
 * Get the common status between users.
 */
Session.prototype.getPlayState = function (socket) {
  // Set waiting sockets to the default state.
  if (socket && this.getReadyState(socket) !== READY_STATE.READY) {
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
    this.emitStateAll(socket)

    return
  }

  var currentTime = this.getTime()

  // Always keep the last know timestamp in check.
  this.lastKnownTime = currentTime
  this.lastKnownTimestamp = Date.now()

  var timeChanged = state.time != null && (currentTime < state.time - TIME_ACCURACY || currentTime > state.time + TIME_ACCURACY)
  var playStateChanged = state.play != null && this.getPlayState(socket) !== state.play
  var readyStateChanged = state.ready != null && this.getReadyState(socket) !== state.ready

  debug('set state', socket.id, state)

  // Update state when things have changed.
  if (!timeChanged && !playStateChanged && !readyStateChanged) {
    return
  }

  var waiting = this.getWaiting(socket)

  // Emit the current state back to the socket when change is invalid.
  if (!waiting) {
    // Update the current time when play state changes.
    if (state.play != null) {
      this.playState = state.play
    }

    if (state.time != null) {
      this.lastKnownTime = state.time
    }

    this.lastKnownSource = socket.id
  }

  if (state.ready != null) {
    this.readyStates[socket.id] = state.ready
  }

  this.emitStateAll(socket)
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
Session.prototype.getTime = function (socket) {
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
    time: this.getTime(currentSocket),
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
  // Update the time before join.
  this.lastKnownTime = this.getTime()
  this.lastKnownTimestamp = Date.now()

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
  if (!this.sockets[socket && socket.id]) {
    return
  }

  delete this.sockets[socket.id]
  delete this.readyStates[socket.id]

  // Reset playback if no one is watching.
  if (this.all().length === 0) {
    this.lastKnownTime = this.getTime()
    this.lastKnownTimestamp = Date.now()
    this.playState = DEFAULT_PLAY_STATE
    this.lastKnownSource = undefined
  }

  // Update state when leaving.
  this.emitStateAll()
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
