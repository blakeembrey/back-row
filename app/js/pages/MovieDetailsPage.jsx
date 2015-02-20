var React = require('react')
var style = require('free-style')
var MoviePoster = require('../components/MoviePoster.jsx')
var MovieDetails = require('../components/MovieDetails.jsx')
var resizeImage = require('../utils/resize-image')

var MOVIE_POSTER_STYLE = style({
  padding: '2em',
  height: 'calc(100vh - 34px)'
})

var MOVIE_CONTENT_STYLE = style({
  flex: 1
})

var MOVIE_PAGE_STYLE = style({
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
      <div style={MOVIE_PAGE_STYLE}>
        <MoviePoster src={coverImage} style={MOVIE_POSTER_STYLE} />

        <MovieDetails movie={movie} style={MOVIE_CONTENT_STYLE} />
      </div>
    );
  }

})

module.exports = MovieDetailsPage
