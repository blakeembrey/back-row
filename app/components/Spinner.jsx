var React = require('react')
var Style = require('react-free-style').create()
var svg = require('raw!./Spinner.svg')

var SPINNER_STYLE = Style.registerStyle({
  margin: '0 auto'
})

var Spinner = React.createClass({

  mixins: [Style.Mixin],

  propTypes: {
    fill: React.PropTypes.string
  },

  componentWillMount () {
    this.fillStyle = this.registerStyle({
      path: {
        fill: this.props.fill
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
