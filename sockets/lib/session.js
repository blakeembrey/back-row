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
 * Time between client pings.
 */
var PING_INTERVAL = 10000

/**
 * Accuracy of the times from clients.
 */
var TIME_ACCURACY = 100

/**
 * Store possible session states.
 */
var READY_STATE = {
  READY: 'ready',
  WAITING: 'waiting'
}

/**
 * Create a session handler.
 */
function Session (options) {
  var self = this

  this.id = uuid.v4()

  this.playState = DEFAULT_PLAY_STATE
  this.sockets = {}
  this.pings = {}
  this.readyStates = {}
  this.options = options

  this.lastKnownTime = 0
  this.lastKnownSource = undefined
  this.lastKnownTimestamp = Date.now()

  // Set up ping handler.
  function ping () {
    self.ping()

    setTimeout(ping, PING_INTERVAL)
  }

  ping()
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
  if (state.ready == null) {
    this.lastKnownSource = socket.id
    this.emitPlayState(socket)

    return
  }

  var play = state.play
  var time = state.time + (play ? this.getPing(socket) : 0)
  var currentTime = this.getTime()
  var timeChanged = currentTime < time - TIME_ACCURACY || currentTime > time + TIME_ACCURACY
  var playStateChanged = this.getPlayState(socket) !== play
  var readyStateChanged = this.getReadyState(socket) !== state.ready

  debug('set state', socket.id, state)

  // Update state when things have changed.
  if (!timeChanged && !playStateChanged && !readyStateChanged) {
    return
  }

  var waiting = this.getWaiting(socket)

  // Emit the current state back to the socket when change is invalid.
  if (!waiting) {
    this.playState = play
    this.lastKnownTime = time
    this.lastKnownTimestamp = Date.now()
    this.lastKnownSource = socket.id
  }

  this.readyStates[socket.id] = state.ready

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
  return socket && this.readyStates[socket.id]
}

/**
 * Join the session.
 */
Session.prototype.join = function (socket, cb) {
  // Add the socket after getting the current time.
  this.sockets[socket.id] = socket

  // Set the initial socket state to pause other clients.
  this.setState(socket, { ready: null })

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
    this.playState = DEFAULT_PLAY_STATE
    this.lastKnownTime = this.getTime()
    this.lastKnownTimestamp = Date.now()
    this.lastKnownSource = undefined
  }

  // Update state when leaving.
  this.emitPlayState()
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

/**
 * Get the ping rate for the socket.
 */
Session.prototype.getPing = function (socket) {
  return this.pings[socket && socket.id] || 0
}

/**
 * Get the ping rate of all socket connections.
 */
Session.prototype.ping = function () {
  var now = Date.now()
  var self = this

  this.all().forEach(function (socket) {
    socket.emit('ping', function () {
      self.pings[socket.id] = Date.now() - now
    })
  })
}
