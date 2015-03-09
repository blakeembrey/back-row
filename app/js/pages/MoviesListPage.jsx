var React = require('react')
var ReactList = require('react-list')
var style = require('free-style')
var Spinner = require('../components/Spinner.jsx')
var MovieItem = require('../components/MovieItem.jsx')
var MoviesStore = require('../stores/MoviesStore')
var MovieListStore = require('../stores/MovieListStore')
var MovieListActions = require('../actions/MovieListActions')
var PageActions = require('../actions/PageActions')
var Colors = require('../constants/Colors')

function getStateFromStores() {
  return {
    movieList: MovieListStore.getList()
  }
}

var LIST_STYLE = style.registerClass({
  textAlign: 'left',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: '0 0.5em'
})

var MoviesListPage = React.createClass({

  mixins: [MovieListStore.Mixin],

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
    return <Spinner fill={Colors.TURQUOISE} style={{ padding: '1em', width: '10em' }} />
  },

  render () {
    var movies = this.state.movieList
      .map(id => MoviesStore.get(id))
      .filter(movie => !!movie)

    PageActions.setTitle('Movies')

    return (
      <ReactList
        items={movies}
        fetch={this.fetch}
        uniform={true}
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
