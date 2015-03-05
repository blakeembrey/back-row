var url = require('url')
var extend = require('extend')
var request = require('request')
var lruCache = require('lru-cache')

/**
 * Export the proxy generator.
 */
module.exports = proxy

/**
 * Generate an Express router proxy.
 *
 * @param  {Object} opts
 * @return {Router}
 */
function proxy (uris, opts) {
  opts = extend({
    max: 200,
    maxAge: 1000 * 60 * 30,
    methods: ['get', 'head', 'options']
  }, opts)

  var RESPONSE_CACHE = lruCache({
    max: opts.max,
    maxAge: opts.maxAge
  })

  // TODO: Build url fallbacks (multiple api urls) and a secondary cache for
  // when all urls are down.
  return function (req, res, next) {
    var path = req.url.substr(1)
    var key = req.method + ':' + path

    /**
     * Respond to the API request.
     *
     * @param {Promise} response
     */
    function respond (response) {
      return response
        .then(function (opts) {
          return res.status(opts.statusCode).set(opts.headers).send(opts.body)
        })
        .catch(function () {
          return res.status(502).end()
        })
    }

    // Remove any `x-forwarded-*` headers set by the upstream proxy.
    // Keeping these headers may cause APIs to do unexpected things, such as
    // Github which redirects requests when `x-forwarded-proto` === `http`.
    Object.keys(req.headers).forEach(function (header) {
      if (header.substr(0, 11) === 'x-forwarded') {
        delete req.headers[header]
      }
    })

    var response = RESPONSE_CACHE.get(key)

    if (!response) {
      response = handle(uris, path, req).then(function (opts) {
        uris = uris.slice(opts.index).concat(uris.slice(0, opts.index))

        return opts
      })

      // Cache the API request for future users.
      if (opts.methods.indexOf(req.method)) {
        RESPONSE_CACHE.set(key,  response)
      }
    }

    return respond(response)
  }
}

/**
 * Make the API request.
 *
 * @param  {Array}   uris
 * @param  {String}  path
 * @param  {Object}  req
 * @param  {Number}  index
 * @return {Promise}
 */
function handle (uris, path, req, index) {
  index = index || 0

  if (index >= uris.length) {
    return Promise.reject(new Error('Load failed'))
  }

  var uri = url.resolve(uris[0], path)

  return new Promise(function (resolve, reject) {
    var proxy = request({
      uri: uri,
      encoding: null,
      method: req.method
    }, function (err, res) {
      if (err || res.statusCode >= 500) {
        return resolve(handle(uris, path, req, index + 1))
      }

      // Never set cookies.
      delete res.headers['set-cookie']
      delete res.headers['set-cookie2']

      return resolve({
        body: res.body,
        statusCode: res.statusCode,
        headers: res.headers,
        index: index
      })
    })

    req.pipe(proxy)
  })
}
