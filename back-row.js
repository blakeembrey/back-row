var http = require('http')
var join = require('path').join
var express = require('express')
var app = module.exports = express()

require('es6-promise').polyfill()

var PORT = process.env.PORT || 3000

app.use(express.static(join(__dirname, 'build')))
app.use(require('./server'))

if (!module.parent) {
  app.listen(PORT, function () {
    console.log('Server started on port ' + PORT)
  })
}
