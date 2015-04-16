var uuid = require('uuid')

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
  TOGGLE: 'toggle',
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
  this.currentPlayState = DEFAULT_PLAY_STATE

  this.lastKnownTime = 0
  this.lastKnownTimestamp = Date.now()

  this._sockets = {}
  this._socketsPlayState = {}
  this._socketsReadyState = {}
  this._options = options
}

/**
 * Emit the current state to all sockets.
 */
Session.prototype.emitPlayState = function (force) {
  var playState = this.getPlayState()

  // Emit new play state to all sockets.
  if (force || playState !== this.currentPlayState) {
    this.sockets().forEach(function (socket) {
      var state = this.getState(socket)

      socket.emit('state', this.id, state)
    }, this)
  }

  this.currentPlayState = playState
}

/**
 * Get the common status between users.
 */
Session.prototype.getPlayState = function () {
  var sockets = this.sockets()

  for (var i = 0; i < sockets.length; i++) {
    var socket = sockets[i]

    if (this.getReadyState(socket) === READY_STATE.WAITING) {
      return false
    }
  }

  return this.playState
}

/**
 * Handle updates in the session state.
 */
Session.prototype.setState = function (socket, state) {
  var readyState = state.ready
  var playState = state.play

  // Only change the playback position on toggle.
  if (readyState === READY_STATE.TOGGLE) {
    this.playState = playState
  }

  this.lastKnownTime = state.time
  this.lastKnownTimestamp = Date.now()

  this._socketsReadyState[socket.id] = readyState

  this.emitPlayState(readyState === READY_STATE.SEEKING)
}

/**
 * Update session options.
 */
Session.prototype.setOptions = function (socket, options) {
  this._options = options

  this.emit('options', this.id, this.getOptions())
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
Session.prototype.getState = function (socket) {
  return {
    play: this.getPlayState(),
    ready: this.getReadyState(socket),
    time: this.getTime()
  }
}

/**
 * Get the current session options.
 */
Session.prototype.getOptions = function () {
  return this._options
}

/**
 * Return an array of user sockets.
 */
Session.prototype.sockets = function () {
  return Object.keys(this._sockets).map(function (key) {
    return this._sockets[key]
  }, this)
}

/**
 * Get a client by id.
 */
Session.prototype.socket = function (id) {
  return this._sockets[id]
}

/**
 * Get data by id.
 */
Session.prototype.getReadyState = function (socket) {
  return this._socketsReadyState[socket.id]
}

/**
 * Join the session.
 */
Session.prototype.join = function (socket) {
  var time = this.getTime()

  // Add the socket after getting the current time.
  this._sockets[socket.id] = socket

  // Set the socket state so other users will wait.
  this.setState(socket, { ready: 'waiting', play: this.playState, time: time })

  // Emit a "joined" event for the client.
  socket.emit('joined', this.id, {
    state: this.getState(socket),
    options: this.getOptions()
  })
}

/**
 * Remove a socket from the session.
 */
Session.prototype.leave = function (socket) {
  var socket = this._sockets[socket && socket.id]

  if (socket) {
    delete this._sockets[socket.id]
    delete this._socketsReadyState[socket.id]

    // Update state when leaving on "ready" mode.
    this.emitPlayState()

    socket.emit('left', this.id)

    // Pause the movie playback if no one is watching.
    if (this.sockets().length === 0) {
      this.playState = DEFAULT_PLAY_STATE
      this.currentPlayState = DEFAULT_PLAY_STATE
      this.lastKnownTime = this.getTime()
      this.lastKnownTimestamp = Date.now()
    }
  }
}

/**
 * Emit an event to all the sockets.
 */
Session.prototype.emit = function () {
  var args = arguments

  this.sockets().forEach(function (socket) {
    socket.emit.apply(socket, args)
  })
}

/**
 * Kill the current session.
 */
Session.prototype.destroy = function () {
  this.sockets().forEach(function (socket) {
    this.leave(socket)
  })
}
