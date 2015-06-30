var mime = require('mime')
var express = require('express')
var pump = require('pump')
var rangeParser = require('range-parser')
var torrent = require('./lib/torrent')
var app = module.exports = new express.Router()

app.get('/stream/:hash', function (req, res, next) {
  var uri = new Buffer(req.params.hash, 'base64').toString()

  return torrent(uri, function (err, engine) {
    if (err) {
      return next(err)
    }

    var range = req.headers.range

    var file = engine.files.reduce(function (a, b) {
      return a.length > b.length ? a : b
    })

    if (range) {
      range = rangeParser(file.length, range)[0]
    }

    res.set('Accept-Ranges', 'bytes')
    res.set('Content-Type', mime.lookup(file.name))

    if (!range) {
      res.set('Content-Length', file.length)

      if (res.method === 'HEAD') {
        return res.end()
      }

      pump(file.createReadStream(), res)
      return
    }

    res.status(206)
    res.set('Content-Length', range.end - range.start + 1)
    res.set('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + file.length)

    if (res.method === 'HEAD') {
      return res.end()
    }

    pump(file.createReadStream(range), res)
  })
})
