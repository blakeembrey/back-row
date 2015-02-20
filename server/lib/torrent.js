var lruCache = require('lru-cache')
var readTorrent = require('read-torrent')
var torrentStream = require('torrent-stream')

/**
 * Create a torrent cache system.
 *
 * TODO: Manage torrent connections properly with peer throttling.
 * TODO: Allow max size to be passed in on initialisation.
 *
 * @type {LRUCache}
 */
var TORRENT_CACHE = lruCache({
  max: 1000 * 1000 * 1000 * 20,
  length: torrentLength,
  dispose: disposeTorrent,
  maxAge: 1000 * 60 * 60 * 24
})

/**
 * Keep track of the latest torrent downloads.
 *
 * @type {LRUCache}
 */
var URI_CACHE = lruCache(100)

/**
 * Dispose of the torrent.
 *
 * @param {String} key
 * @param {Object} torrent
 */
function disposeTorrent (key, torrent) {
  return torrent.remove(function () {})
}

/**
 * Return the torrent download size.
 *
 * @param  {Object} torrent
 * @return {Number}
 */
function torrentLength (torrent) {
  return torrent.swarm.downloaded
}

/**
 * Export the torrent stream.
 */
module.exports = torrent

/**
 * Create a torrent stream.
 *
 * @param {String}   uri
 * @param {Function} done
 */
function torrent (uri, done) {
  if (/^magnet:|^https?:\/\//i.test(uri)) {
    return createTorrent(uri, done)
  }

  return done(new Error('Unknown torrent specified'))
}

/**
 * Create a torrent stream, attempting to use the cache first.
 *
 * @param {String}   uri
 * @param {Function} done
 */
function createTorrent (uri, done) {
  /**
   * Create a callback from getting torrent information.
   *
   * @param  {Error}    err
   * @param  {Object}   torrent
   * @return {Function}
   */
  function callback (err, torrent) {
    if (err) {
      return done(err)
    }

    // Cache the torrent uri lookup.
    URI_CACHE.set(uri, torrent)

    // Get the torrent information.
    var engine = TORRENT_CACHE.get(torrent.infoHash)

    // Initialise the torrent stream.
    if (!engine) {
      engine = createEngine(torrent)

      TORRENT_CACHE.set(engine.infoHash, engine)
    }

    if (engine.torrent) {
      return done(null, engine)
    }

    return engine.on('ready', function () {
      return done(null, engine)
    })
  }

  // Retrieve from the uri cache first.
  if (URI_CACHE.has(uri)) {
    return callback(null, URI_CACHE.get(uri))
  }

  return readTorrent(uri, callback)
}

/**
 * Create a new torrent stream.
 *
 * @param  {String} uri
 * @return {Object}
 */
function createEngine (uri) {
  var engine = torrentStream(uri)

  // Resume/pause downloading as needed.
  engine.on('interested', function () { engine.swarm.resume() })
  engine.on('uninterested', function () { engine.swarm.pause() })

  return engine
}
