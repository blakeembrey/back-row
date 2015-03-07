var fs = require('fs')
var os = require('os')
var join = require('path').join
var lruCache = require('lru-cache')
var readTorrent = require('read-torrent')
var torrentStream = require('torrent-stream')

var TORRENT_PATH = join(os.tmpDir(), 'back-row-info-hashes')

/**
 * Create a torrent cache.
 *
 * @type {LRUCache}
 */
var TORRENT_CACHE = lruCache({
  max: process.env.TORRENT_CACHE_LIMIT || 10 * 1000 * 1000 * 1000,
  length: torrentLength,
  dispose: disposeTorrent
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
  if (!/^magnet:|^https?:\/\//i.test(uri)) {
    return done(new Error('Unknown torrent specified'))
  }

  return createTorrentFromUri(uri, done)
}

/**
 * Create a torrent stream from a uri.
 *
 * @param {String}   uri
 * @param {Function} done
 */
function createTorrentFromUri (uri, done) {
  function next (err, torrent) {
    if (err) {
      return done(err)
    }

    URI_CACHE.set(uri, torrent)

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
  var exists = !!engine

  function next (engine) {
    // Avoid unnecessary torrent persistence creation.
    if (exists) {
      return done(null, engine)
    }

    var path = join(TORRENT_PATH, engine.infoHash)
    var info = JSON.stringify(engine.torrent)

    return fs.writeFile(path, info, function (err) {
      return done(err, engine)
    })
  }

  if (!engine) {
    engine = createEngine(torrent)

    TORRENT_CACHE.set(engine.infoHash, engine)
  }

  if (engine.torrent) {
    return next(engine)
  }

  return engine.on('ready', function () {
    return next(engine)
  })
}

/**
 * Create a new torrent stream.
 *
 * @param  {String} uri
 * @return {Object}
 */
function createEngine (uri) {
  var engine = torrentStream(uri)

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
 * Create and/or read existing torrent files into application.
 */
(function () {
  var stat;

  try {
    stat = fs.statSync(TORRENT_PATH)
  } catch (e) {}

  if (!stat || !stat.isDirectory()) {
    return fs.mkdirSync(TORRENT_PATH)
  }

  // Load existing torrent hashes.
  fs.readdirSync(TORRENT_PATH).forEach(function (hash) {
    var file = join(TORRENT_PATH, hash)
    var torrent = JSON.parse(fs.readFileSync(file, 'utf8'))

    return createTorrent(torrent, logError)
  })
})()
