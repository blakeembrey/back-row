var React = require('react')
var Style = require('react-free-style').create()
var MoviePoster = require('../components/MoviePoster.jsx')
var MovieDetails = require('../components/MovieDetails.jsx')
var resizeImage = require('../utils/resize-image')

var MOVIE_POSTER_STYLE = Style.registerStyle({
  padding: '1em',
  height: 'calc(100vh - 34px)'
})

var MOVIE_DETAILS_STYLE = Style.registerStyle({
  flex: 1,
  padding: '1em'
})

var MOVIE_PAGE_STYLE = Style.registerStyle({
  flex: 1,
  flexDirection: 'row'
})

var MovieDetailsPage = React.createClass({

  mixins: [Style.Mixin],

  propTypes: {
    movie: React.PropTypes.object.isRequired
  },

  render () {
    var movie = this.props.movie
    var coverImage = resizeImage(movie.coverImage, window.innerWidth)

    return (
      <div className={MOVIE_PAGE_STYLE.className}>
        <MoviePoster src={coverImage} className={MOVIE_POSTER_STYLE.className} />

        <MovieDetails movie={movie} className={MOVIE_DETAILS_STYLE.className} />
      </div>
    );
  }

})

module.exports = MovieDetailsPage
