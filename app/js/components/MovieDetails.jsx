var React = require('react')
var Style = require('react-free-style').fresh()
var Link = require('react-router').Link
var moment = require('moment')

var MOVIE_TITLE_STYLE = Style.registerClass({
  margin: '1em 0',
  fontWeight: 'bold',
  fontSize: '2em'
})

var MovieDetails = React.createClass({

  mixins: [Style.Mixin],

  propTypes: {
    movie: React.PropTypes.object.isRequired
  },

  render: function () {
    var movie = this.props.movie

    return (
      <div>
        <h2 className={MOVIE_TITLE_STYLE.className}>{movie.title}</h2>

        <div>
          <span>{moment(movie.released).format('MMM YYYY')}</span>

          <span>{movie.runtime + ' min'}</span>

          <a href={'http://www.imdb.com/title/' + movie.imdbId}>IMDB</a>

          <a href={movie.trailer}>Trailer</a>
        </div>

        <div>{movie.overview}</div>

        <div>
          <Link to="watchMovie" params={{ imdbId: movie.imdbId }}>
            Watch
          </Link>
        </div>
      </div>
    )
  }

})

module.exports = MovieDetails
