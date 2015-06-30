var express = require('express')
var proxy = require('./lib/proxy')
var app = module.exports = new express.Router()

app.use('/yts', proxy([
  'https://yts.to/api/',
  'https://eqwww.image.yt/api/',
  'https://yts.io/api/'
]))

app.use('/trakt', proxy([
  'https://api-v2launch.trakt.tv/'
]))
