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
  options: SessionStateOptions
  state: SessionStateState
}

interface SessionStateOptions {
  imdbId: string
  quality: string
}

interface SessionStateState {
  sort: number
  time: number
  play: boolean
  ready: string
  waiting: number
}

export default class SessionStore extends Store<SessionState> {

  state: SessionState = {
    sessions: {}
  }

  handlers = {
    setConnection: SessionConstants.CREATE_CONNECTION,
    joinedSession: [SessionConstants.JOIN_SESSION, SessionConstants.CREATE_SESSION],
    leftSession: SessionConstants.LEAVE_SESSION,
    setSessionState: SessionConstants.UPDATE_SESSION_STATE
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

  setSessionState (sessionId: string, state: SessionStateState) {
    var currentSession = this.state.sessions[sessionId]

    if (!currentSession || currentSession.state.sort > state.sort) {
      return
    }

    this.state.sessions[sessionId] = <Session> extend(currentSession, { state })

    this.hasChanged()
  }

}
