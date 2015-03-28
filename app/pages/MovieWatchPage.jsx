var React = require('react')
var Style = require('react-free-style').create()
var Video = require('../components/Video.jsx')
var MovieActions = require('../actions/MovieActions')
var MovieTorrentStore = require('../stores/MovieTorrentStore')

var CONTAINER_STYLE = Style.registerStyle({
  flex: 1
})

function getStateFromStores (imdbId) {
  return {
    torrents: MovieTorrentStore.get(imdbId)
  }
}

var MovieWatchPage = React.createClass({

  mixins: [Style.Mixin, MovieTorrentStore.Mixin],

  propTypes: {
    movie: React.PropTypes.object.isRequired
  },

  getInitialState () {
    return getStateFromStores(this.props.movie.imdbId)
  },

  onChange () {
    this.setState(getStateFromStores(this.props.movie.imdbId))
  },

  componentWillMount () {
    MovieActions.getMovieTorrent(this.props.movie.imdbId)
  },

  render () {
    var movie = this.props.movie
    var torrents = this.state.torrents

    // TODO: Loading...
    if (!torrents) {
      return <div />
    }

    var videoSrc = '/torrent/stream?uri=' + encodeURIComponent(torrents[0].url)

    return (
      <div className={CONTAINER_STYLE.className}>
        <Video src={videoSrc} poster={movie.backgroundImage} />
      </div>
    )
  }

})

module.exports = MovieWatchPage
