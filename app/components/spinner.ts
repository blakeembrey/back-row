import React = require('react')
import { create, FreeStyle } from 'react-free-style'
import { TURQUOISE } from '../utils/colors'

var svg = require('raw!./spinner.svg')
var Style = create()

var SPINNER_STYLE = Style.registerStyle({
  margin: '0 auto',
  padding: '1em',
  width: '9em',
  flex: '0 1 auto',
  WebkitFlex: '0 1 auto'
})

class Spinner extends React.Component<{ fill: string; className?: string }, {}> {

  static contextTypes: React.ValidationMap<any> = {
    freeStyle: React.PropTypes.object.isRequired
  }

  fillStyle: FreeStyle.Style

  componentWillMount () {
    this.fillStyle = this.context.freeStyle.registerStyle({
      path: {
        fill: this.props.fill || TURQUOISE
      }
    })
  }

  componentWillUnmount () {
    this.context.freeStyle.remove(this.fillStyle)
  }

  render () {
    return React.createElement(
      'span',
      {
        className: Style.join(this.props.className, this.fillStyle.className, SPINNER_STYLE.className),
        dangerouslySetInnerHTML: { __html: svg }
      }
    )
  }

}

export default Style.component(Spinner)
