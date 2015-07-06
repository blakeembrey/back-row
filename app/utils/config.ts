export const BASE_URL = typeof __URL__ === 'undefined' ? window.location.origin : __URL__
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const TRAKT_TV_CLIENT_ID = process.env.TRAKT_TV_CLIENT_ID
export const TRAKT_TV_CLIENT_SECRET = process.env.TRAKT_TV_CLIENT_SECRET
