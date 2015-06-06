import io = require('socket.io-client')
import { ActionCreators } from 'marty'
import SessionConstants from '../constants/session'

import { BASE_URL } from '../utils/config'

interface SessionCreateOpts {
  imdbId: string
  quality: string
}

class SessionActionCreators extends ActionCreators {

  connect () {
    return new Promise((resolve: () => void) => {
      this.dispatch(SessionConstants.CREATE_CONNECTION_STARTING)

      const connection = io.connect(BASE_URL + '/session')

      // Connect to the server.
      connection.connect()

      connection.once('connect', () => {
        this.dispatch(SessionConstants.CREATE_CONNECTION, connection)

        resolve()
      })

      connection.on('state', (sessionId: string, state: any) => {
        this.dispatch(SessionConstants.UPDATE_SESSION_STATE, sessionId, state)
      })

      connection.on('options', (sessionId: string, options: any) => {
        this.dispatch(SessionConstants.UPDATE_SESSION_OPTIONS, sessionId, options)
      })
    })
  }

  create (options: SessionCreateOpts) {
    return new Promise((resolve: (value: string) => void) => {
      const { connection } = this.app.sessionStore.state

      this.dispatch(SessionConstants.CREATE_SESSION_STARTING)

      connection.emit('create', options)

      connection.once('joined', (sessionId: string, data: any) => {
        this.dispatch(SessionConstants.CREATE_SESSION, sessionId, data)

        return resolve(sessionId)
      })
    })
  }

  join (sessionId: string) {
    return new Promise((resolve: () => void) => {
      const { connection } = this.app.sessionStore.state

      // Handle successful session joins.
      var joinedCallback = (sessionId: string, data: any) => {
        this.dispatch(SessionConstants.JOIN_SESSION, sessionId, data)

        connection.off('joinFailed', joinFailedCallback)

        return resolve()
      }

      // Handle failures to join an active session.
      var joinFailedCallback = () => {
        this.dispatch(SessionConstants.JOIN_SESSION_FAILED, sessionId)

        connection.off('joined', joinedCallback)

        return resolve()
      }

      this.dispatch(SessionConstants.JOIN_SESSION_STARTING, sessionId)

      connection.emit('join', sessionId)

      connection.once('joined', joinedCallback)
      connection.once('joinFailed', joinFailedCallback)
    })
  }

  leave (sessionId: string) {
    const { connection } = this.app.sessionStore.state

    this.dispatch(SessionConstants.LEAVE_SESSION_STARTING)

    connection.disconnect()

    this.dispatch(SessionConstants.LEAVE_SESSION, sessionId)

    return Promise.resolve(sessionId)
  }

  updateState (sessionId: string, state: { play: boolean; ready: string; time: number }) {
    const { connection } = this.app.sessionStore.state

    this.dispatch(SessionConstants.UPDATE_SESSION_STATE_STARTING)

    if (!connection) {
      return
    }

    connection.emit('state', sessionId, state)

    this.dispatch(SessionConstants.UPDATE_SESSION_STATE, sessionId, state)

    return Promise.resolve(state)
  }

}

export default SessionActionCreators
