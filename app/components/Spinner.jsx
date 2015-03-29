var React = require('react')
var Style = require('react-free-style').create()
var svg = require('raw!./Spinner.svg')
var Colors = require('../constants/Colors')

var SPINNER_STYLE = Style.registerStyle({
  margin: '0 auto',
  padding: '1em',
  width: '9em'
})

var Spinner = React.createClass({

  mixins: [Style.Mixin],

  propTypes: {
    fill: React.PropTypes.string
  },

  componentWillMount () {
    this.fillStyle = this.registerStyle({
      path: {
        fill: this.props.fill || Colors.TURQUOISE
      }
    })
  },

  render () {
    // http://jxnblk.com/loading/
    return <span
      className={Style.join(this.props.className, this.fillStyle.className, SPINNER_STYLE.className)}
      dangerouslySetInnerHTML={{ __html: svg }} />
  }

})

module.exports = Spinner
