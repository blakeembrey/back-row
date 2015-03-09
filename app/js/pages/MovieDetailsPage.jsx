var React = require('react')
var style = require('free-style')
var MoviePoster = require('../components/MoviePoster.jsx')
var MovieDetails = require('../components/MovieDetails.jsx')
var resizeImage = require('../utils/resize-image')

var MOVIE_POSTER_STYLE = style.registerClass({
  padding: '2em',
  height: 'calc(100vh - 34px)'
})

var MOVIE_CONTENT_STYLE = style.registerClass({
  flex: 1
})

var MOVIE_PAGE_STYLE = style.registerClass({
  flex: 1,
  flexDirection: 'row'
})

var MovieDetailsPage = React.createClass({

  propTypes: {
    movie: React.PropTypes.object.isRequired
  },

  render: function () {
    var movie = this.props.movie
    var coverImage = resizeImage(movie.coverImage, window.innerWidth)

    return (
      <div className={MOVIE_PAGE_STYLE.className}>
        <MoviePoster src={coverImage} className={MOVIE_POSTER_STYLE.className} />

        <MovieDetails movie={movie} className={MOVIE_CONTENT_STYLE.className} />
      </div>
    );
  }

})

module.exports = MovieDetailsPage
