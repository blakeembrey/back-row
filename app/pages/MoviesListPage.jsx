var React = require('react')
var ReactList = require('react-list')
var Style = require('react-free-style').create()
var Spinner = require('../components/Spinner.jsx')
var MovieItem = require('../components/MovieItem.jsx')
var MovieStore = require('../stores/MovieStore')
var MovieListStore = require('../stores/MovieListStore')
var MovieListActions = require('../actions/MovieListActions')
var PageActions = require('../actions/PageActions')
var Colors = require('../constants/Colors')

function getStateFromStores() {
  return {
    movieList: MovieListStore.getList()
  }
}

var LIST_STYLE = Style.registerStyle({
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: '0 0.5em'
})

var LIST_CONTAINER_STYLE = Style.registerStyle({
  flex: 1
})

var SPINNER_STYLE = Style.registerStyle({
  padding: '1em',
  width: '10em',
  flex: 1,
  justifyContent: 'center'
})

var MovieListContainer = React.createClass({

  render () {
    return <div className={LIST_CONTAINER_STYLE.className}>{this.props.children}</div>
  }

})

var MoviesListPage = React.createClass({

  mixins: [Style.Mixin, MovieListStore.Mixin],

  getInitialState: getStateFromStores,

  fetch (cb) {
    var self = this

    return MovieListActions.nextPage()
      .then(function () {
        return cb(null, !MovieListStore.hasMore())
      })
      .catch(function (err) {
        console.log(err.stack)

        return cb(err)
      })
  },

  renderItem (movie, index) {
    return <MovieItem key={index} movie={movie} />
  },

  renderItems (children) {
    return <div className={LIST_STYLE.className} ref='items'>{children}</div>
  },

  renderLoading () {
    return <Spinner fill={Colors.TURQUOISE} className={SPINNER_STYLE.className} />
  },

  render () {
    var movies = this.state.movieList
      .map(id => MovieStore.get(id))
      .filter(movie => !!movie)

    PageActions.setTitle('Movies')

    return (
      <ReactList
        items={movies}
        fetch={this.fetch}
        uniform={true}
        component={MovieListContainer}
        renderItem={this.renderItem}
        renderItems={this.renderItems}
        renderLoading={this.renderLoading}
        renderError={this.renderError}
        renderEmpty={this.renderEmpty} />
    )
  },

  onChange () {
    this.setState(getStateFromStores())
  }

})

module.exports = MoviesListPage
