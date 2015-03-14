var React = require('react')
var Style = require('react-free-style').fresh()
var svg = require('./Spinner.html')

var SPINNER_STYLE = Style.registerClass({
  margin: '0 auto'
})

var Spinner = React.createClass({

  mixins: [Style.Mixin],

  propTypes: {
    fill: React.PropTypes.string
  },

  render () {
    var spinnerFillStyle = Style.registerClass({
      path: {
        fill: this.props.fill
      }
    })

    return <span
      className={Style.join(this.props.className, spinnerFillStyle.className, SPINNER_STYLE.className)}
      dangerouslySetInnerHTML={{ __html: svg }} />
  }

})

module.exports = Spinner
