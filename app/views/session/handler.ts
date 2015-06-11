import React = require('react')
import { create } from 'react-free-style'
import { createContainer } from 'marty'
import Spinner from '../../components/spinner'
import App from '../../app'
import Watch from './components/watch'
import { Session } from '../../stores/session'

const Style = create()

const FAILED_JOIN_STYLE = Style.registerStyle({
  textAlign: 'center'
})

interface SessionProps {
  app: App
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

    app.pageActionCreators.title('Watching session...')

    return React.createElement(Watch, {
      session,
      latency,
      onChange: (state: any) => {
        app.sessionActionCreators.updateState(session.id, state)
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
    this.app.pageActionCreators.title('Loading session...')

    return React.createElement(Spinner)
  },
  failed (errors: any) {
    this.app.pageActionCreators.title('Failed to load session...')

    return React.createElement('span', {
      className: FAILED_JOIN_STYLE.className
    }, 'Failed to load session')
  }
}))
