var React = require('react')
var Style = require('react-free-style').create()
var MoviePoster = require('../components/MoviePoster.jsx')
var MovieDetails = require('../components/MovieDetails.jsx')
var resizeImage = require('../utils/resize-image')

var MOVIE_PAGE_STYLE = Style.registerStyle({
  flex: '0 1 auto',
  flexDirection: 'column',
  alignSelf: 'center',

  '@media (min-width: 680px)': {
    maxWidth: 980,
    flexDirection: 'row'
  }
})

var MOVIE_POSTER_STYLE = Style.registerStyle({
  padding: '1em',
  maxHeight: 280,
  height: 'calc(100vh - 34px)',

  '@media (min-width: 680px)': {
    maxHeight: 500
  }
})

var MOVIE_DETAILS_STYLE = Style.registerStyle({
  flex: 1,
  padding: '1em'
})

var MovieDetailsPage = React.createClass({

  mixins: [Style.Mixin],

  propTypes: {
    movie: React.PropTypes.object.isRequired,
    torrents: React.PropTypes.array.isRequired
  },

  render () {
    var coverImage = resizeImage(this.props.movie.coverImage, window.innerWidth)

    return (
      <div className={MOVIE_PAGE_STYLE.className}>
        <MoviePoster src={coverImage} className={MOVIE_POSTER_STYLE.className} />

        <MovieDetails {...this.props} className={MOVIE_DETAILS_STYLE.className} />
      </div>
    );
  }

})

module.exports = MovieDetailsPage
