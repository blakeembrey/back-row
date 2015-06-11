import React = require('react')
import { createContainer } from 'marty'
import { create } from 'react-free-style'
import Spinner from '../../components/spinner'
import Application from '../../app'

const Style = create()

const FAILED_CREATE_STYLE = Style.registerStyle({
  textAlign: 'center'
})

interface CreateSessionState {
  error?: any
}

class CreateSessionView extends React.Component<{ app: Application }, CreateSessionState> {

  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.func.isRequired
  }

  state: CreateSessionState = {}

  componentWillMount () {
    const { imdbId, quality } = this.context.router.getCurrentQuery()
    const { sessionStore, sessionActionCreators } = this.props.app

    sessionStore.getConnection()
      .toPromise()
      .then(() => {
        return sessionActionCreators.create({ imdbId, quality })
      })
      .then((sessionId: string) => {
        return this.context.router.replaceWith('session', { sessionId })
      })
      .catch((error) => {
        this.setState({ error })
      })
  }

  render () {
    if (this.state.error) {
      this.props.app.pageActionCreators.title('Failed to create session')

      return React.createElement('span', {
        className: FAILED_CREATE_STYLE.className
      }, 'Failed to create a new movie session')
    }

    this.props.app.pageActionCreators.title('Creating session...')

    return React.createElement(Spinner)
  }

}

export default createContainer(CreateSessionView)
