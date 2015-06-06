var io = module.exports = require('socket.io')()
var lruCache = require('lru-cache')
var debug = require('debug')('back-row:session')
var Session = require('./lib/session')

var session = io.of('/session')

/**
 * Delete the session after 5 minutes.
 */
var SESSION_TIMEOUT = 5 * 60 * 1000

/**
 * Sesssion LRU cache options.
 */
var SESSIONS_CACHE_OPTIONS = {
  max: 200, // Concurrent sesssions.
  dispose: function (id, session) {
    // Remove all current user sessions.
    session.sockets().forEach(function (socket) {
      USERS.del(socket.id)
    })

    // Destroy the current session instance.
    session.destroy()
  }
}

/**
 * Users LRU cache options.
 */
var USERS_CACHE_OPTIONS = {
  max: 1000, // Concurrent users.
  dispose: function (id, session) {
    session.leave(session.sockets[id])
  }
}

/**
 * Keep track of active users/sessions.
 */
var USERS = lruCache(USERS_CACHE_OPTIONS) /* [socketId: string]: Session */
var SESSIONS = lruCache(SESSIONS_CACHE_OPTIONS) /* [sessionId: string]: Session */

/**
 * Manage session socket connections.
 */
session.on('connection', function (socket) {
  /**
   * Create a new session room.
   */
  socket.on('create', function (options) {
    var session = new Session(options)

    debug('create session', session.id, socket.id)

    // Track the session id until everyone leaves.
    USERS.set(socket.id, session)
    SESSIONS.set(session.id, session)

    socket.emit('created', session.id)

    session.join(socket)
  })

  /**
   * Trigger state updates.
   */
  socket.on('state', function (sessionId, state) {
    var session = SESSIONS.get(sessionId)

    return session && session.setState(socket, state)
  })

  /**
   * Update user options.
   */
  socket.on('options', function (sessionId, options) {
    var session = SESSIONS.get(sessionId)

    return session && session.setOptions(socket, options)
  })

  /**
   * Add a user to a session.
   */
  socket.on('join', function (sessionId) {
    var session = SESSIONS.get(sessionId)

    if (!session) {
      socket.emit('joinFailed')

      return
    }

    USERS.set(socket.id, session)

    debug('join session', session.id, socket.id)

    session.join(socket)
  })

  /**
   * Run session leave logic.
   */
  function leave () {
    var session = USERS.get(socket.id)

    if (session) {
      USERS.del(socket.id)

      debug('leave session', session.id, socket.id)

      session.leave(socket)
    }
  }

  /**
   * Leave the active session.
   */
  socket.on('leave', leave)
  socket.on('disconnect', leave)
})
