export var BASE_URL = typeof __URL__ === 'undefined' ? window.location.origin : __URL__
export var IS_PRODUCTION = process.env.NODE_ENV === 'production'
export var TRAKT_TV_CLIENT_ID = process.env.TRAKT_TV_CLIENT_ID
export var TRAKT_TV_CLIENT_SECRET = process.env.TRAKT_TV_CLIENT_SECRET
