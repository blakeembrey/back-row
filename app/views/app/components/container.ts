import React = require('react')
import { create, injectStyle } from 'react-free-style'

const Style = create()

const CONTAINER_STYLE = Style.registerStyle({
  minWidth: '100%',
  minHeight: 'calc(100vh - 34px)',
  justifyContent: 'center',
  WebkitJustifyContent: 'center'
})

@injectStyle(Style)
export default class Container extends React.Component<{ children: React.ComponentClass<any> }, {}> {

  render () {
    return React.createElement(
      'div',
      { className: CONTAINER_STYLE.className },
      React.createElement(this.props.children)
    )
  }

}
