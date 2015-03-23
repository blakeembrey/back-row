var React = require('react')
var RouteHandler = require('react-router').RouteHandler
var Style = require('react-free-style').create()
var MoviesStore = require('../stores/MoviesStore')
var PageActions = require('../actions/PageActions')
var MovieActions = require('../actions/MovieActions')
var resizeImage = require('../utils/resize-image')

function getStateFromStores (imdbId) {
  return {
    movie: MoviesStore.get(imdbId)
  }
}

var CONTAINER_STYLE = Style.registerStyle({
  flex: 1,
  backgroundColor: '#000'
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

  mixins: [Style.Mixin, MoviesStore.Mixin],

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return getStateFromStores(this.context.router.getCurrentParams().imdbId)
  },

  onChange: function () {
    this.setState(getStateFromStores(this.context.router.getCurrentParams().imdbId))
  },

  componentWillMount: function () {
    MovieActions.getMovie(this.context.router.getCurrentParams().imdbId)
  },

  render: function () {
    var movie = this.state.movie

    PageActions.setTitle(movie ? movie.title : 'Loading...')

    // TODO: Render loading indicator.
    if (!movie) {
      return <div />
    }

    var backdropImage = resizeImage(movie.backgroundImage, window.innerWidth)

    var backgroundStyle = {
      backgroundImage: Style.url(backdropImage)
    }

    return (
      <div className={CONTAINER_STYLE.className}>
        <div className={BACKGROUND_STYLE.className} style={backgroundStyle} />

        <RouteHandler movie={movie} />
      </div>
    )
  }

})

module.exports = MoviePage
