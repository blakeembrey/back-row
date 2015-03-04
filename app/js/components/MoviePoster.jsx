var React = require('react')
var style = require('free-style')

var POSTER_STYLE = style.createClass({
  height: '100%'
})

var IMAGE_STYLE = style.createClass({
  height: '100%',
  boxShadow: '0 0 6px rgba(0, 0, 0, 0.5)',
  borderRadius: 5
})

var MoviePoster = React.createClass({

  propTypes: {
    src: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      <div className={style.join(this.props.className, POSTER_STYLE.className)}>
        <img src={this.props.src} className={IMAGE_STYLE.className} />
      </div>
    )
  }

})

module.exports = MoviePoster
