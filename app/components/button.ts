import React = require('react')
import chroma = require('chroma-js')
import { create } from 'react-free-style'
import { GREEN_SEA } from '../utils/colors'

var Style = create()

var BUTTON_STYLE = Style.registerStyle({
  padding: '0.6em 1.125em',
  fontSize: '1.1em',
  cursor: 'pointer',
  color: '#fff',
  borderRadius: '3px',
  backgroundColor: GREEN_SEA,
  border: '1px solid transparent',
  transition: 'border .25s linear, color .25s linear, background-color .25s linear',
  display: 'block',
  whiteSpace: 'nowrap',

  '&:hover': {
    backgroundColor: chroma(GREEN_SEA).brighter(5).hex()
  }
})

class Button extends React.Component<{ children: any }, {}> {

  render () {
    return React.createElement(
      'div',
      { className: BUTTON_STYLE.className },
      this.props.children
    )
  }

}

export default Style.component(Button)
