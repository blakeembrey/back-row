var Store = require('../core/Store')
var Dispatcher = require('../core/Dispatcher')
var ActionTypes = require('../constants/ActionTypes')

var _movies = {}

var MoviesTorrentStore = new Store({

  get (imdbId) {
    return _movies[imdbId]
  }

})

function addYtsMovie (movie) {
  _movies[movie.imdb_code] = movie.torrents
}

MoviesTorrentStore.dispatcherToken = Dispatcher.register(function (payload) {
  var action = payload.action

  switch (action.type) {
    case ActionTypes.LOAD_YTS_MOVIE:
      addYtsMovie(action.body)
      MoviesTorrentStore.emitChange()
      break
  }
})

module.exports = MoviesTorrentStore
