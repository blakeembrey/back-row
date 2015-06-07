import { Store } from 'marty'
import extend = require('xtend')
import SessionConstants from '../constants/session'

export interface SessionState {
  connection?: any
  latency?: number[]
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
  ready: string
  waiting: number
  timestamp: number
  from: string
  peers: string[]
}

export default class SessionStore extends Store<SessionState> {

  state: SessionState = {
    latency: [],
    sessions: {}
  }

  handlers = {
    setConnection: SessionConstants.CREATE_CONNECTION,
    joinedSession: [SessionConstants.JOIN_SESSION, SessionConstants.CREATE_SESSION],
    leftSession: SessionConstants.LEAVE_SESSION,
    updateSessionState: SessionConstants.UPDATE_SESSION_STATE,
    updateLatency: SessionConstants.UPDATE_LATENCY
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

    if (!currentSession || currentSession.state.timestamp > newState.timestamp) {
      return
    }

    const state = extend(currentSession.state, newState)

    this.state.sessions[sessionId] = <Session> extend(currentSession, { state })

    this.hasChanged()
  }

  updateLatency (latency: number) {
    this.state.latency.unshift(latency)
    this.state.latency.length = 5 // Track the last 5 latency counts.

    this.hasChanged()
  }

  getLatency () {
    const { latency } = this.state

    var sum = latency.reduce((sum, value) => {
      return sum + value
    }, 0)

    return Math.ceil(sum / latency.length)
  }

}
