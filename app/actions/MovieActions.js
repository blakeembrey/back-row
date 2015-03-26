var request = require('../utils/request')
var Dispatcher = require('../core/Dispatcher')
var ActionTypes = require('../constants/ActionTypes')
var MoviesStore = require('../stores/MoviesStore')
var MoviesYtsStore = require('../stores/MoviesYtsStore')

var MovieActions = {

  getMovie (imdbId) {
    var movie = MoviesStore.get(imdbId)

    if (movie) {
      return Promise.resolve(movie)
    }

    var uri = '/movie/summary/{TRAKT_TV_API_KEY}/' + imdbId

    return request.trakt(uri)
      .then(function (res) {
        Dispatcher.handleServerAction({
          type: ActionTypes.LOAD_TRAKT_MOVIE,
          body: res.body
        })
      })
  },

  getYtsMovie (imdbId) {
    var movie = MoviesYtsStore.get(imdbId)

    if (movie) {
      return Promise.resolve(movie)
    }

    return request.yts('/v2/list_movies.json?query_term=' + imdbId)
      .then(function (res) {
        var movie = res.body.data.movies[0]

        Dispatcher.handleServerAction({
          type: ActionTypes.LOAD_YTS_MOVIE,
          body: movie
        })

        return movie
      })
  }

}

module.exports = MovieActions
