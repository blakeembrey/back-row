var Store = require('../core/Store')
var Dispatcher = require('../core/Dispatcher')
var ActionTypes = require('../constants/ActionTypes')

var _total = 0
var _count = 0
var _movieIds = {}
var _movieList = []

var MovieListStore = new Store({

  getList: function () {
    return _movieList
  },

  getCount: function () {
    return _count
  },

  getTotal: function () {
    return _total
  },

  hasMore: function () {
    return _count < _total
  }

})

MovieListStore.dispatchToken = Dispatcher.register(function (payload) {
  var action = payload.action

  switch (action.type) {
    case ActionTypes.LOAD_MOVIES_LIST:
      _total = action.body.data.movie_count
      _count += action.body.data.movies.length

      action.body.data.movies.forEach(function (movie) {
        var imdbId = movie.imdb_code

        if (!_movieIds[imdbId]) {
          _movieList.push(imdbId)
        }

        _movieIds[imdbId] = true
      })

      MovieListStore.emitChange()
      break
  }
})

module.exports = MovieListStore
