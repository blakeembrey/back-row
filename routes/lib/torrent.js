var fs = require('fs')
var os = require('os')
var join = require('path').join
var lruCache = require('lru-cache')
var readTorrent = require('read-torrent')
var torrentStream = require('torrent-stream')
var debug = require('debug')('back-row:torrent')
var mkdirp = require('mkdirp')
var parseTorrent = require('parse-torrent')

var TORRENT_PATH = process.env.TORRENT_CACHE_PATH || join(os.tmpDir(), 'back-row')
var TORRENT_INFO_HASH_PATH = join(TORRENT_PATH, 'info-hash')
var TORRENT_CACHE_LIMIT = Number(process.env.TORRENT_CACHE_LIMIT) || 10 * 1000 * 1000 * 1000 // 10GB

/**
 * Create a torrent cache.
 *
 * @type {LRUCache}
 */
var TORRENT_CACHE = lruCache({
  max: TORRENT_CACHE_LIMIT,
  length: torrentLength,
  dispose: disposeTorrent
}) /* { [infoHash: string]: engine } */

/**
 * Keep track of the latest torrent downloads.
 *
 * @type {LRUCache}
 */
var URI_CACHE = lruCache(100) /* { [uri: string]: torrent } */

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
function removeTorrent (engine, cb) {
  engine.remove(function (rmError) {
    fs.unlink(cacheFilename(engine), function (unlinkError) {
      cb(rmError || unlinkError)
    })
  })
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
 * Return a consistent file location for torrents.
 *
 * @param  {Object} engine
 * @return {String}
 */
function cacheFilename (engine) {
  return join(TORRENT_INFO_HASH_PATH, engine.infoHash + '.torrent')
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

    if (/^https?:\/\//i.test(uri)) {
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
  var exists = !!engine

  if (!engine) {
    engine = createEngine(torrent)
  }

  function next (engine) {
    // Avoid unnecessary torrent persistence creation.
    if (exists) {
      return done(null, engine)
    }

    TORRENT_CACHE.set(engine.infoHash, engine)

    return mkdirp(TORRENT_INFO_HASH_PATH, function (err) {
      if (err) {
        return done(err)
      }

      var buf = parseTorrent.toTorrentFile(engine.torrent)

      return fs.writeFile(cacheFilename(engine), buf, function (err) {
        return done(err, engine)
      })
    })
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
  var engine = torrentStream(uri, {
    tmp: TORRENT_PATH
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
  try {
    fs.statSync(TORRENT_INFO_HASH_PATH)
  } catch (e) {
    return // Ignore rebooting when hashes are empty.
  }

  var hashes = fs.readdirSync(TORRENT_INFO_HASH_PATH)

  console.log('Found ' + hashes.length + ' hashes in ' + TORRENT_INFO_HASH_PATH)

  hashes.forEach(function (hash) {
    var filename = join(TORRENT_INFO_HASH_PATH, hash)
    var torrent = parseTorrent(fs.readFileSync(filename))

    console.log('Restarting torrent stream:', torrent.name)

    return createTorrent(torrent, logError)
  })
})()
