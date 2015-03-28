var React = require('react')
var Style = require('react-free-style').create()
var chroma = require('chroma-js')
var Colors = require('../constants/Colors')

var BUTTON_STYLE = Style.registerStyle({
  padding: '0.6em 1.125em',
  fontSize: '1.1em',
  cursor: 'pointer',
  color: '#fff',
  borderRadius: '3px',
  backgroundColor: Colors.GREEN_SEA,
  border: '1px solid transparent',
  transition: 'border .25s linear, color .25s linear, background-color .25s linear',

  '&:hover': {
    backgroundColor: chroma(Colors.GREEN_SEA).brighter(4).hex()
  }
})

var Button = React.createClass({

  mixins: [Style.Mixin],

  render () {
    return (
      <div className={BUTTON_STYLE.className}>{this.props.children}</div>
    )
  }

})

module.exports = Button
