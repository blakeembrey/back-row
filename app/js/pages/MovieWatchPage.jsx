var React = require('react')
var style = require('free-style')
var Video = require('../components/Video.jsx')
var MovieActions = require('../actions/MovieActions')
var MoviesYtsStore = require('../stores/MoviesYtsStore')

function getStateFromStores (imdbId) {
  return {
    ytsMovie: MoviesYtsStore.get(imdbId)
  }
}

var MovieWatchPage = React.createClass({

  mixins: [MoviesYtsStore.Mixin],

  propTypes: {
    movie: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return getStateFromStores(this.props.movie.imdbId)
  },

  onChange: function () {
    this.setState(getStateFromStores(this.props.movie.imdbId))
  },

  componentWillMount: function () {
    MovieActions.getYtsMovie(this.props.movie.imdbId)
  },

  render: function () {
    var movie = this.props.movie
    var ytsMovie = this.state.ytsMovie

    // TODO: Loading...
    if (!ytsMovie) {
      return <div />
    }

    var videoSrc = '/torrent/stream?uri=' + encodeURIComponent(ytsMovie.torrents[0].url)

    return (
      <div style={style({ flex: 1 })}>
        <Video src={videoSrc} poster={movie.backgroundImage} />
      </div>
    )
  }

})

module.exports = MovieWatchPage
