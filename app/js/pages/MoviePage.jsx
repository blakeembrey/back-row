var React = require('react')
var State = require('react-router').State
var RouteHandler = require('react-router').RouteHandler
var Style = require('react-free-style').fresh()
var MoviesStore = require('../stores/MoviesStore')
var PageActions = require('../actions/PageActions')
var MovieActions = require('../actions/MovieActions')
var resizeImage = require('../utils/resize-image')

function getStateFromStores (imdbId) {
  return {
    movie: MoviesStore.get(imdbId)
  }
}

var CONTAINER_STYLE = Style.registerClass({
  flex: 1,
  backgroundColor: '#000'
})

var BACKGROUND_STYLE = Style.registerClass({
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

  mixins: [State, Style.Mixin, MoviesStore.Mixin],

  getInitialState: function () {
    return getStateFromStores(this.getParams().imdbId)
  },

  onChange: function () {
    this.setState(getStateFromStores(this.getParams().imdbId))
  },

  componentWillMount: function () {
    MovieActions.getMovie(this.getParams().imdbId)
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
