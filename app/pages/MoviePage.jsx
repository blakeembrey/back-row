var React = require('react')
var extend = require('extend')
var RouteHandler = require('react-router').RouteHandler
var Style = require('react-free-style').create()
var MovieStore = require('../stores/MovieStore')
var PageActions = require('../actions/PageActions')
var MovieActions = require('../actions/MovieActions')
var resizeImage = require('../utils/resize-image')
var MovieTorrentStore = require('../stores/MovieTorrentStore')
var Spinner = require('../components/Spinner')

function getStateFromStores (imdbId) {
  var torrents = MovieTorrentStore.get(imdbId)

  return {
    movie: MovieStore.get(imdbId),
    torrents: torrents,
    torrent: torrents && torrents[0]
  }
}

var CONTAINER_STYLE = Style.registerStyle({
  flex: 1,
  backgroundColor: '#000',
  justifyContent: 'center'
})

var BACKGROUND_STYLE = Style.registerStyle({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  opacity: 0.3,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})
var MoviePage = React.createClass({

  mixins: [Style.Mixin, MovieStore.Mixin, MovieTorrentStore.Mixin],

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  getInitialState () {
    return getStateFromStores(this.context.router.getCurrentParams().imdbId)
  },

  onChange () {
    this.setState(getStateFromStores(this.context.router.getCurrentParams().imdbId))
  },

  componentWillMount () {
    var imdbId = this.context.router.getCurrentParams().imdbId

    MovieActions.getMovie(imdbId)
    MovieActions.getMovieTorrent(imdbId)
  },

  render () {
    var movie = this.state.movie
    var torrents = this.state.torrents

    PageActions.setTitle(movie ? movie.title : 'Loading...')

    if (!movie || !torrents) {
      return <Spinner />
    }

    var backgroundStyle = {
      backgroundImage: Style.url(resizeImage(movie.backgroundImage, window.innerWidth))
    }

    return (
      <div className={CONTAINER_STYLE.className}>
        <div className={BACKGROUND_STYLE.className} style={backgroundStyle} />

        <RouteHandler movie={movie} torrent={this.state.torrent} torrents={torrents} selectTorrent={(torrent) => this.setState({ torrent })} />
      </div>
    )
  }

})

module.exports = MoviePage
