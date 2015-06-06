import React = require('react')
import { create } from 'react-free-style'
import { createContainer } from 'marty'
import Spinner from '../../components/spinner'
import Application from '../../app'
import Watch from './components/watch'
import { Session } from '../../stores/session'

const Style = create()

const FAILED_JOIN_STYLE = Style.registerStyle({
  textAlign: 'center'
})

interface SessionProps {
  app: Application
  session: Session
  latency: number
}

class SessionView extends React.Component<SessionProps, {}> {

  componentWillUnmount () {
    const { app, session } = this.props

    app.sessionActionCreators.leave(session.id)
  }

  render () {
    const { app, session, latency } = this.props

    return React.createElement(Watch, {
      session,
      latency,
      onChange: (play: boolean, ready: string, time: number) => {
        app.sessionActionCreators.updateState(session.id, { play, ready, time })
      }
    })
  }

}

export default Style.component(createContainer(SessionView, {
  listenTo: ['sessionStore'],
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },
  fetch: {
    session () {
      const { sessionId } = this.context.router.getCurrentParams()

      return this.app.sessionStore.getSession(sessionId)
    },
    latency () {
      return this.app.sessionStore.getLatency()
    }
  },
  pending () {
    return React.createElement(Spinner)
  },
  failed (errors: any) {
    return React.createElement('span', {
      className: FAILED_JOIN_STYLE.className
    }, 'Failed to join session')
  }
}))
