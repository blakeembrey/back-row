import React = require('react')
import { create } from 'react-free-style'

var Style = create()

var CONTAINER_STYLE = Style.registerStyle({
  minWidth: '100%',
  minHeight: 'calc(100vh - 34px)',
  justifyContent: 'center',
  WebkitJustifyContent: 'center'
})

class Header extends React.Component<{ children: React.ComponentClass<any> }, {}> {

  render () {
    return React.createElement(
      'div',
      { className: CONTAINER_STYLE.className },
      React.createElement(this.props.children)
    )
  }

}

export default Style.component(Header)
