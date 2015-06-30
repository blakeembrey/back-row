var os = require('os')
var join = require('path').join
var basename = require('path').basename
var lruCache = require('lru-cache')
var readTorrent = require('read-torrent')
var torrentStream = require('torrent-stream')
var glob = require('glob')
var debug = require('debug')('back-row:torrent')

var TORRENT_PATH = process.env.TORRENT_CACHE_PATH || join(os.tmpDir(), 'torrent-stream')
var TORRENT_STREAM_NAME = basename(TORRENT_PATH)
var TORRENT_STREAM_PATH = join(TORRENT_PATH, '..')

/**
 * Create a torrent cache.
 *
 * @type {LRUCache}
 */
var TORRENT_CACHE = lruCache({
  max: process.env.TORRENT_CACHE_LIMIT || 10 * 1000 * 1000 * 1000, // 10GB
  length: torrentLength,
  dispose: disposeTorrent
})

/**
 * Keep track of the latest torrent downloads.
 *
 * @type {LRUCache}
 */
var URI_CACHE = lruCache(100) /* { [infoHash: string]: engine } */

/**
 * Dispose of the torrent.
 *
 * @param {String} key
 * @param {Object} torrent
 */
function disposeTorrent (key, torrent) {
  removeTorrent(torrent, logError)
}

/**
 * Remove the torrent from the filesystem.
 *
 * @param {Object}   torrent
 * @param {Function} cb
 */
function removeTorrent (torrent, cb) {
  torrent.remove(cb)
}

/**
 * Return the torrent download size.
 *
 * @param  {Object} torrent
 * @return {Number}
 */
function torrentLength (engine) {
  return engine.torrent ? engine.torrent.length : 0
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
  if (!/^magnet:|^https?:\/\//i.test(uri)) {
    return done(new Error('Unknown torrent specified'))
  }

  debug('torrent', uri)

  return createTorrentFromLocation(uri, done)
}

/**
 * Create a torrent stream from a uri.
 *
 * @param {String}   uri
 * @param {Function} done
 */
function createTorrentFromLocation (uri, done) {
  function next (err, torrent) {
    if (err) {
      return done(err)
    }

    if (/https?:\/\//i.test(uri)) {
      URI_CACHE.set(uri, torrent)
    }

    return createTorrent(torrent, done)
  }

  if (URI_CACHE.has(uri)) {
    return next(null, URI_CACHE.get(uri))
  }

  return readTorrent(uri, next)
}

/**
 * Create a torrent engine from an object.
 *
 * @param {Object}   torrent
 * @param {Function} done
 */
function createTorrent (torrent, done) {
  var engine = TORRENT_CACHE.get(torrent.infoHash)

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

/**
 * Create a new torrent stream.
 *
 * @param  {String} uri
 * @return {Object}
 */
function createEngine (uri) {
  var engine = torrentStream(uri, {
    tmp: TORRENT_STREAM_PATH,
    name: TORRENT_STREAM_NAME
  })

  engine.on('error', logError)
  engine.on('interested', function () { engine.swarm.resume() })
  engine.on('uninterested', function () { engine.swarm.pause() })

  return engine
}

/**
 * Log an error callback that isn't handled otherwise.
 *
 * @param {Error} err
 */
function logError (err) {
  if (err) {
    console.log(err)
  }
}

/**
 * Create and/or read existing torrent files into application. This is an
 * in-memory solution to keeping the cache within the defined limit.
 */
(function () {
  var torrents = glob.sync('*.torrent', {
    cwd: TORRENT_PATH
  })

  console.log('Found ' + torrents.length + ' torrent streams from ' + TORRENT_PATH)

  torrents.forEach(function (filename) {
    return createTorrentFromLocation(join(TORRENT_PATH, filename), logError)
  })
})()
