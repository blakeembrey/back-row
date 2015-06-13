import io = require('socket.io-client')
import extend = require('xtend')
import { ActionCreators } from 'marty'
import SessionConstants from '../constants/session'
import { diff } from '../utils/common'

import { BASE_URL } from '../utils/config'

interface SessionCreateOpts {
  imdbId: string
  quality: string
}

interface VideoState {
  play: boolean
  ready: string
  time: number
}

class SessionActionCreators extends ActionCreators {

  connect () {
    return new Promise((resolve: () => void) => {
      this.dispatch(SessionConstants.CREATE_CONNECTION_STARTING)

      const connection = io.connect(BASE_URL + '/session')

      // Connect to the server.
      connection.connect()

      this.dispatch(SessionConstants.CREATE_CONNECTION, connection)

      // Resolve once it says we've connected.
      connection.once('connect', resolve)

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

      connection.emit('create', options, (sessionId: string, data: any) => {
        this.dispatch(SessionConstants.CREATE_SESSION, sessionId, data)

        return resolve(sessionId)
      })
    })
  }

  join (sessionId: string) {
    return new Promise((resolve: () => void) => {
      const { connection } = this.app.sessionStore.state

      this.dispatch(SessionConstants.JOIN_SESSION_STARTING, sessionId)

      connection.emit('join', sessionId, (data: any) => {
        if (data) {
          this.dispatch(SessionConstants.JOIN_SESSION, sessionId, data)
        } else {
          this.dispatch(SessionConstants.JOIN_SESSION_FAILED, sessionId)
        }

        return resolve()
      })
    })
  }

  leave (sessionId: string) {
    return new Promise((resolve: () => void) => {
      const { connection } = this.app.sessionStore.state

      this.dispatch(SessionConstants.LEAVE_SESSION_STARTING)

      connection.disconnect()

      this.dispatch(SessionConstants.LEAVE_SESSION, sessionId)

      connection.once('disconnect', resolve)
    })
  }

  updateState (sessionId: string, newState: VideoState) {
    return new Promise((resolve: () => void) => {
      const { connection } = this.app.sessionStore.state
      const currentState = this.app.sessionStore.state.sessions[sessionId].state

      if (!connection) {
        return resolve()
      }

      // Emit the state diff since it can be handled faster by the server.
      const state = diff(currentState, newState)

      this.dispatch(SessionConstants.UPDATE_SESSION_STATE, sessionId, extend(state, {
        play: false,
        updating: true
      }))

      connection.emit('state', sessionId, state, (state: any) => {
        this.dispatch(SessionConstants.UPDATE_SESSION_STATE, sessionId, extend(state, {
          updating: false
        }))

        return resolve()
      })
    })
  }

}

export default SessionActionCreators
