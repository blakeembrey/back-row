import React = require('react')
import chroma = require('chroma-js')
import { create } from 'react-free-style'
import { GREEN_SEA } from '../utils/colors'

const Style = create()

const BUTTON_STYLE = Style.registerStyle({
  padding: '0.6em 1.125em',
  fontSize: '1.1em',
  color: '#fff',
  borderRadius: '3px',
  backgroundColor: GREEN_SEA,
  border: '1px solid transparent',
  transition: 'border .25s linear, color .25s linear, background-color .25s linear',
  display: 'block',
  whiteSpace: 'nowrap'
})

const BUTTON_ACTIVE_STYLE = Style.registerStyle({
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: chroma(GREEN_SEA).brighter(0.5).hex()
  }
})

interface ButtonProps {
  children: any
  className: string
  disabled: boolean
}

class Button extends React.Component<ButtonProps, {}> {

  render () {
    return React.createElement(
      'div',
      {
        className: Style.join(this.props.className, BUTTON_STYLE.className, this.props.disabled ? null : BUTTON_ACTIVE_STYLE.className)
      },
      this.props.children
    )
  }

}

export default Style.component(Button)
