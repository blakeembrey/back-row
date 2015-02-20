var Store = require('../core/Store')
var Dispatcher = require('../core/Dispatcher')
var ActionTypes = require('../constants/ActionTypes')

var _movies = {}

var MoviesYtsStore = new Store({

  get: function (imdbId) {
    return _movies[imdbId]
  }

})

function addYtsMovie (movie) {
  _movies[movie.imdb_code] = movie
}

MoviesYtsStore.dispatcherToken = Dispatcher.register(function (payload) {
  var action = payload.action

  switch (action.type) {
    case ActionTypes.LOAD_YTS_MOVIE:
      addYtsMovie(action.body)
      MoviesYtsStore.emitChange()
      break
  }
})

module.exports = MoviesYtsStore
