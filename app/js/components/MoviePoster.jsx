var React = require('react')
var style = require('free-style')

var POSTER_STYLE = style({
  height: '100%'
})

var IMAGE_STYLE = style({
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
      <div style={style(POSTER_STYLE, this.props.style)}>
        <img src={this.props.src} style={IMAGE_STYLE} />
      </div>
    )
  }

})

module.exports = MoviePoster
