var http = require('http')
var join = require('path').join
var express = require('express')
var cors = require('cors')

var app = express()
var server = http.Server(app)

var PORT = process.env.PORT || 3000

app.use(express.static(join(__dirname, 'build')))
app.use(cors())
app.use(require('./routes'))

require('./sockets').attach(server)

if (!module.parent) {
  server.listen(PORT, function () {
    console.log('Server started on port ' + PORT)
  })

  process.on('uncaughtException', function (err) {
    console.error(new Date().toUTCString() + ' uncaughtException:', err.message)
    console.error(err.stack)
    process.exit(1)
  })
}

module.exports = server
