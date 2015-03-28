var extend = require('extend')
var Store = require('../core/Store')
var Dispatcher = require('../core/Dispatcher')
var ActionTypes = require('../constants/ActionTypes')

var _movies = {}

var MovieStore = new Store({

  get (imdbId) {
    return _movies[imdbId]
  }

})

function addTraktMovie (movie) {
  var imdbId = movie.imdb_id

  _movies[imdbId] = {
    imdbId: imdbId,
    cerfication: movie.certification,
    genres: movie.genres,
    coverImage: movie.images.poster,
    backgroundImage: movie.images.fanart,
    overview: movie.overview,
    runtime: movie.runtime,
    released: new Date(movie.released * 1000),
    title: movie.title,
    trailer: movie.trailer
  }
}

MovieStore.dispatchToken = Dispatcher.register(function (payload) {
  var action = payload.action

  switch (action.type) {
    case ActionTypes.LOAD_TRAKT_MOVIES:
      action.body.forEach(addTraktMovie)
      MovieStore.emitChange()
      break

    case ActionTypes.LOAD_TRAKT_MOVIE:
      addTraktMovie(action.body)
      MovieStore.emitChange()
      break
  }
})

module.exports = MovieStore
