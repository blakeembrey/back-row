var request = require('../utils/request')
var Dispatcher = require('../core/Dispatcher')
var ActionTypes = require('../constants/ActionTypes')
var MovieListStore = require('../stores/MovieListStore')

var MovieListActions = {

  nextPage: function () {
    var set = (MovieListStore.getCount() / 50) + 1
    var uri = '/v2/list_movies.json?sort_by=peers&limit=50&page=' + set

    return request.yts(uri)
      .then(function (res) {
        var body = res.body
        var ids = body.data.movies.map(x => x.imdb_code)

        return MovieListActions.loadSummaries(ids).then(() => body)
      })
      .then(function (body) {
        Dispatcher.handleServerAction({
          type: ActionTypes.LOAD_MOVIES_LIST,
          body: body
        })
      })
  },

  loadSummaries: function (ids) {
    var uri = '/movie/summaries/{TRAKT_TV_API_KEY}/' + ids.join(',') + '/full'

    return request.trakt(uri)
      .then(function (res) {
        Dispatcher.handleServerAction({
          type: ActionTypes.LOAD_TRAKT_MOVIES,
          body: res.body
        })
      })
  }

}

module.exports = MovieListActions
