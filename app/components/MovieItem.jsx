var React = require('react')
var Style = require('react-free-style').create()
var Link = require('react-router').Link
var resizeImage = require('../utils/resize-image')
var Colors = require('../constants/Colors')

var BORDER = 3
var WIDTH = ~~((138 * 0.95) + BORDER)
var HEIGHT = ~~((207 * 0.95) + BORDER)

var TITLE_STYLE = Style.registerStyle({
  margin: '6px 0 0',
  color: Colors.CLOUDS,
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
})

var COVER_STYLE = Style.registerStyle({
  width: WIDTH,
  height: HEIGHT,
  borderRadius: BORDER,
  backgroundColor: '#000',
  border: '2px solid ' + Colors.SILVER,
  overflow: 'hidden'
})

var BACKGROUND_STYLE = Style.registerStyle({
  flex: 1,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})

var ITEM_STYLE = Style.registerStyle({
  margin: '0.8em',
  width: WIDTH,
  fontSize: '0.8em',
  textDecoration: 'none',

  ['&:hover ' + COVER_STYLE.selector]: {
    borderColor: Colors.ALIZARIN
  },

  ['&:hover ' + BACKGROUND_STYLE.selector]: {
    opacity: 0.5
  }
})

var MovieItem = React.createClass({

  mixins: [Style.Mixin],

  propTypes: {
    movie: React.PropTypes.object.isRequired
  },

  render () {
    var movie = this.props.movie

    var backgroundStyle = {
      backgroundImage: Style.url(resizeImage(this.props.movie.coverImage, 134))
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
