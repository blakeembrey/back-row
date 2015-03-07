var React = require('react')
var extend = require('extend')
var style = require('free-style')
var svg = require('./Spinner.html')
var Colors = require('../constants/Colors')

var SPINNER_STYLE = style.createClass({
  margin: '0 auto',
  path: {
    fill: Colors.TURQUOISE
  }
})

var Spinner = React.createClass({

  render () {
    return <span
      className={SPINNER_STYLE.className}
      dangerouslySetInnerHTML={{ __html: svg }}
      style={this.props.style} />
  }

})

module.exports = Spinner
