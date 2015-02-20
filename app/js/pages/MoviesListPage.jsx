var React = require('react')
var ReactList = require('react-list')
var style = require('free-style')
var MovieItem = require('../components/MovieItem.jsx')
var MoviesStore = require('../stores/MoviesStore')
var MovieListStore = require('../stores/MovieListStore')
var MovieListActions = require('../actions/MovieListActions')
var PageActions = require('../actions/PageActions')

function getStateFromStores() {
  return {
    movieList: MovieListStore.getList()
  }
}

var LIST_STYLE = style({
  textAlign: 'left',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: '0 0.5em'
})

var MoviesListPage = React.createClass({

  mixins: [MovieListStore.Mixin],

  getInitialState: getStateFromStores,

  fetch: function (cb) {
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

  renderItem: function (movie, index) {
    return (
      <MovieItem key={index} movie={movie} />
    )
  },

  renderItems: function (children) {
    return (
      <div style={LIST_STYLE} ref="items">{children}</div>
    )
  },

  render: function () {
    var movies = this.state.movieList.map(function (id) {
      return MoviesStore.get(id)
    })

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

  onChange: function () {
    this.setState(getStateFromStores())
  }

})

module.exports = MoviesListPage
