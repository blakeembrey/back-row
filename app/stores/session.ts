import { Store } from 'marty'
import extend = require('xtend')
import SessionConstants from '../constants/session'

export interface SessionState {
  connection?: any
  sessions?: {
    [sessionId: string]: Session
  }
}

export interface Session {
  id: string
  state: SessionStateState
  options: SessionStateOptions
}

interface SessionStateOptions {
  imdbId: string
  quality: string
}

interface SessionStateState {
  time: number
  play: boolean
  updating: boolean
  ready: string
  waiting: number
  timestamp: number
  from: string
  peers: string[]
}

export default class SessionStore extends Store<SessionState> {

  state: SessionState = {
    sessions: {}
  }

  handlers = {
    setConnection: SessionConstants.CREATE_CONNECTION,
    joinedSession: [SessionConstants.JOIN_SESSION, SessionConstants.CREATE_SESSION],
    leftSession: SessionConstants.LEAVE_SESSION,
    updateSessionState: SessionConstants.UPDATE_SESSION_STATE
  }

  getConnection () {
    return this.fetch({
      id: 'connection',
      locally: () => {
        return this.state.connection
      },
      remotely: () => {
        return this.app.sessionActionCreators.connect()
      }
    })
  }

  setConnection (connection: any) {
    this.setState({ connection })
  }

  joinedSession (sessionId: string, data: Session) {
    this.state.sessions[sessionId] = <Session> extend({ id: sessionId }, data)

    this.hasChanged()
  }

  getSession (sessionId: string) {
    return this.fetch({
      id: sessionId,
      locally: () => {
        return this.state.sessions[sessionId]
      },
      remotely: () => {
        return this.app.sessionActionCreators.join(sessionId)
      },
      dependsOn: [this.getConnection()]
    })
  }

  leftSession (sessionId: string) {
    delete this.state.connection
    delete this.state.sessions[sessionId]

    this.hasChanged()
  }

  updateSessionState (sessionId: string, newState: SessionStateState) {
    const currentSession = this.state.sessions[sessionId]

    const state = extend(currentSession.state, newState)

    this.state.sessions[sessionId] = <Session> extend(currentSession, { state })

    this.hasChanged()
  }

}
