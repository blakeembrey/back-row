var React = require('react')
var Style = require('react-free-style').create()
var Colors = require('../constants/Colors')

var POSTER_STYLE = Style.registerStyle({
  alignItems: 'center',
  justifyContent: 'center'
})

var CONTAINER_STYLE = Style.registerStyle({
  height: '100%'
})

var IMAGE_STYLE = Style.registerStyle({
  borderRadius: 3,
  maxHeight: '100%',
  maxWidth: '100%'
})

var MoviePoster = React.createClass({

  mixins: [Style.Mixin],

  propTypes: {
    src: React.PropTypes.string.isRequired
  },

  render () {
    return (
      <div className={Style.join(this.props.className, POSTER_STYLE.className)}>
        <div className={CONTAINER_STYLE.className}>
          <img src={this.props.src} className={IMAGE_STYLE.className} />
        </div>
      </div>
    )
  }

})

module.exports = MoviePoster
