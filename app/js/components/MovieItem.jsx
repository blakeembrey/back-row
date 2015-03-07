var React = require('react')
var style = require('free-style')
var Link = require('react-router').Link
var resizeImage = require('../utils/resize-image')
var Colors = require('../constants/Colors')

var BORDER = 3
var WIDTH = ~~((138 * 0.95) + BORDER)
var HEIGHT = ~~((207 * 0.95) + BORDER)

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
  borderRadius: BORDER,
  backgroundColor: '#000',
  border: '2px solid ' + Colors.MIDNIGHT_BLUE,
  overflow: 'hidden'
})

var BACKGROUND_STYLE = style.createClass({
  flex: 1,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})

var ITEM_STYLE = style.createClass({
  margin: '0.8em',
  width: WIDTH,
  fontSize: '0.8em',
  textDecoration: 'none',

  ['&:hover ' + COVER_STYLE.selector]: {
    borderColor: Colors.ALIZARIN
  },

  ['&:hover ' + BACKGROUND_STYLE.selector]: {
    opacity: 0.6
  }
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
        <div className={COVER_STYLE.className}>
          <div className={BACKGROUND_STYLE.className} style={backgroundStyle} />
        </div>
        <p className={TITLE_STYLE.className}>{movie.title}</p>
      </Link>
    )
  }

})

module.exports = MovieItem
