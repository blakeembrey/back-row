var express = require('express');
var proxy   = require('./lib/proxy');
var app     = module.exports = new express.Router();

app.use('/yts', proxy([
  'https://yts.re/api/',
  'https://yts.pm/api/',
  'https://yts.io/api/',
  'https://yts-proxy.net/api/',
  'https://yts.wf/api/'
]));

app.use('/trakt', proxy([
  'https://api.trakt.tv/'
]));
