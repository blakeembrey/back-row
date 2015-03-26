var keymirror = require('keymirror')

var ACTION_TYPES = keymirror({
  SET_PAGE_TITLE: null,

  LOAD_YTS_MOVIE: null,
  LOAD_YTS_MOVIES: null,
  LOAD_TRAKT_MOVIE: null,
  LOAD_TRAKT_MOVIES: null,

  LOAD_MOVIES_LIST: null
})

module.exports = ACTION_TYPES
