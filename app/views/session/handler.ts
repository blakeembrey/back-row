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
}

class SessionView extends React.Component<SessionProps, {}> {

  componentWillUnmount () {
    const { app, session } = this.props

    app.sessionActionCreators.leave(session.id)
  }

  render () {
    const { app, session } = this.props
    const { options, state, id } = session
    const { time, play, waiting } = state
    const { imdbId, quality } = options

    return React.createElement(Watch, {
      imdbId,
      quality,
      time,
      play,
      onChange: (play: boolean, ready: string, time: number) => {
        app.sessionActionCreators.updateState(session.id, { play, waiting, ready, time })
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
