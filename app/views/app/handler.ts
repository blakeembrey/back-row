import React = require('react')
import { create } from 'react-free-style'
import { RouteHandler } from 'react-router'
import Header from './components/header'
import Container from './components/container'
import { MIDNIGHT_BLUE } from '../../utils/colors'

var Style = create()

var APP_STYLE = Style.registerStyle({
  color: '#fff',
  minWidth: '100vw',
  minHeight: '100vh'
})

class AppView extends React.Component<{}, {}> {

  render () {
    return React.createElement(
      'div',
      { className: APP_STYLE.className },
      React.createElement(Header),
      React.createElement(Container, null, RouteHandler),
      React.createElement(Style.Element)
    )
  }

}

export default Style.component(AppView)
