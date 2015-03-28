var request = require('../utils/request')
var Dispatcher = require('../core/Dispatcher')
var ActionTypes = require('../constants/ActionTypes')

var MovieActions = {

  getMovie (imdbId) {
    var uri = '/movie/summary/{TRAKT_TV_CLIENT_ID}/' + imdbId

    return request.trakt(uri)
      .then(function (res) {
        Dispatcher.handleServerAction({
          type: ActionTypes.LOAD_TRAKT_MOVIE,
          body: res.body
        })
      })
  },

  getMovieTorrent (imdbId) {
    return request.yts('/v2/list_movies.json?query_term=' + imdbId)
      .then(function (res) {
        Dispatcher.handleServerAction({
          type: ActionTypes.LOAD_YTS_MOVIE,
          body: res.body.data.movies[0]
        })
      })
  }

}

module.exports = MovieActions
