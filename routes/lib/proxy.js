var resolve = require('url').resolve
var extend = require('xtend')
var popsicle = require('popsicle')
var status = require('popsicle-status')
var lruCache = require('lru-cache')
var debug = require('debug')('back-row:proxy')

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
    max: 400,
    maxAge: 1000 * 60 * 60 * 2,
    methods: ['get', 'head', 'options']
  }, opts)

  var RESPONSE_CACHE = lruCache({
    max: opts.max,
    maxAge: opts.maxAge
  })

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
          return res.status(opts.status).set(opts.headers).send(opts.body)
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
      response = handle(uris, path, req)
        .then(function (data) {
          uris = uris.slice(data.index).concat(uris.slice(0, data.index))

          return data
        })

      // Cache the API request for future users.
      if (opts.methods.indexOf(req.method)) {
        RESPONSE_CACHE.set(key, response)
      }
    } else {
      response.then(function (data) {
        debug('response (from cache)', data.url, data.status)
      })
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

  var url = resolve(uris[0], path)

  return popsicle({
    url: url,
    method: req.method,
    headers: req.headers,
    body: req,
    raw: true,
    encoding: 'buffer'
  })
    .use(function (req) {
      req.after(function (res) {
        debug('response', url, res.status)
      })
    })
    .use(status(200, 499))
    .then(function (res) {
      return {
        body: res.body,
        status: res.status,
        headers: res.get(),
        index: index,
        url: url
      }
    })
    .catch(function () {
      return handle(uris, path, req, index + 1)
    })
}
