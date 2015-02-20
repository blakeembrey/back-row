var express = require('express')
var app = module.exports = express()

app.use('/proxy', require('./proxy'))
app.use('/torrent', require('./torrent'))
