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
  var updatedAt = Date.now()

  // TODO: Add methods to proxy option.
  opts = extend({
    max: 200,
    maxAge: 1000 * 60 * 30
  }, opts)

  // Create a response cache to hold the most recent requests.
  var RESPONSE_CACHE = lruCache({
    max:    opts.max,
    maxAge: opts.maxAge
  })

  // TODO: Build url fallbacks (multiple api urls) and a secondary cache for
  // when all urls are down.
  return function (req, res, next) {
    var path = req.url.substr(1)
    var key = req.method + ':' + path

    /**
     * Respond to the request.
     *
     * @param {Object} opts
     */
    function respond (opts) {
      res.status(opts.statusCode)
      res.set(opts.headers)
      res.send(opts.body)
    }

    // Remove any `x-forwarded-*` headers set by the upstream proxy.
    // Keeping these headers may cause APIs to do unexpected things, such as
    // Github which redirects requests when `x-forwarded-proto` === `http`.
    Object.keys(req.headers).forEach(function (header) {
      if (header.substr(0, 11) === 'x-forwarded') {
        delete req.headers[header]
      }
    })

    // Respond if the response has already been cached.
    if (RESPONSE_CACHE.has(key)) {
      return respond(RESPONSE_CACHE.get(key))
    }

    // Recursively call each uri until success.
    return (function handle (attemptsRemaining) {
      if (!attemptsRemaining) {
        return res.status(502).end()
      }

      var now = Date.now()
      var uri = url.resolve(uris[0], path)

      var proxy = request({
        uri: uri,
        timeout: 2 * 60 * 1000,
        encoding: null,
        method: req.method
      }, function (err, res) {
        if (err || res.statusCode >= 500) {
          if (now > updatedAt) {
            updatedAt = now
            uris.push(uris.shift())
          }

          return handle(attemptsRemaining - 1)
        }

        // Remove cookies.
        delete res.headers['set-cookie']
        delete res.headers['set-cookie2']

        // Cache the response body and headers, if the response was valid.
        RESPONSE_CACHE.set(key, {
          body: res.body,
          statusCode: res.statusCode,
          headers: res.headers
        })

        return respond(res)
      })

      return req.pipe(proxy)
    })(uris.length)
  }
}
