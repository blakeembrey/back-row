var uuid = require('uuid')
var debug = require('debug')('back-row:session')

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

  this.lastKnownTime = 0
  this.lastKnownTimestamp = Date.now()

  this._sockets = {}
  this._socketsReadyState = {}
  this._options = options
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
Session.prototype.emitPlayState = function (currentSocket, currentPlayState, force) {
  var playState = this.getPlayState()

  // Emit new play state to all sockets.
  if (force || playState !== this.previousPlayState) {
    this.sockets().forEach(function (socket) {
      // Ensure the current play state is correct. This blocks clients from
      // playing when it should be waiting.
      if (currentSocket.id === socket.id && playState === currentPlayState) {
        return
      }

      this.emitState(socket)
    }, this)
  }

  // Store for next emit.
  this.previousPlayState = playState
}

/**
 * Check if we have waiting sockets.
 */
Session.prototype.getWaiting = function (currentSocket) {
  return this.sockets()
    .filter(function (socket) {
      return socket !== currentSocket &&
        this.getReadyState(socket) === READY_STATE.WAITING
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
  var readyState = state.ready
  var playState = state.play
  var previousReadyState = this.getReadyState(socket)

  debug('set state', socket.id, state)

  // Update ready state before we emit anything.
  this._socketsReadyState[socket.id] = readyState

  // Update the play state when not waiting.
  if (!state.waiting) {
    this.playState = playState
  }

  this.lastKnownTime = state.time
  this.lastKnownTimestamp = Date.now()

  this.emitPlayState(socket, playState, readyState === READY_STATE.SEEKING)
}

/**
 * Update session options.
 */
Session.prototype.setOptions = function (socket, options) {
  this._options = options

  debug('set options', socket.id, options)

  this.emit('options', this.id, options)
}

/**
 * Calculate the current time.
 */
Session.prototype.getTime = function (socket) {
  if (this.getPlayState(socket) !== true) {
    return this.lastKnownTime
  }

  return this.lastKnownTime + (Date.now() - this.lastKnownTimestamp)
}

/**
 * Get the current session playback state.
 */
Session.prototype.getState = function (socket) {
  return {
    play: this.getPlayState(socket),
    ready: this.getReadyState(socket),
    time: this.getTime(socket),
    waiting: this.getWaiting(socket),
    sort: Date.now()
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

  // Set the initial socket state to pause other clients.
  this.setState(socket, {
    play: this.playState,
    ready: 'waiting',
    waiting: this.getWaiting(),
    time: time
  })

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
    this.emitPlayState(socket)

    // Pause the movie playback if no one is watching.
    if (this.sockets().length === 0) {
      this.playState = DEFAULT_PLAY_STATE
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
