var React = require('react')
var style = require('free-style')
var Link = require('react-router').Link
var resizeImage = require('../utils/resize-image')

var WIDTH = 138 * 0.95
var HEIGHT = 207 * 0.95

var ITEM_STYLE = style.createClass({
  margin: '0.8em',
  display: 'inline-block',
  width: WIDTH,
  fontSize: '0.8em',
  textDecoration: 'none'
})

var TITLE_STYLE = style.createClass({
  margin: '6px 0 0',
  color: '#fff',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
})

var COVER_STYLE = style.createClass({
  width: WIDTH,
  height: HEIGHT,
  backgroundSize: 'cover',
  borderRadius: 3
})

var MovieItem = React.createClass({

  propTypes: {
    movie: React.PropTypes.object.isRequired
  },

  render: function () {
    var movie = this.props.movie

    var backgroundStyle = {
      backgroundImage: style.url(resizeImage(movie.coverImage, 134))
    }

    return (
      <Link to="movie" params={{ imdbId: movie.imdbId }} className={ITEM_STYLE.className}>
        <div className={COVER_STYLE.className} style={backgroundStyle} />
        <p className={TITLE_STYLE.className}>{movie.title}</p>
      </Link>
    )
  }

})

module.exports = MovieItem
