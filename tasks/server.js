var gulp = require('gulp')
var join = require('path').join
var express = require('express')
var WebpackDevServer = require('webpack-dev-server')
var webpack = require('./support/webpack')
var PORT = process.env.PORT || (process.env.PORT = 3000)
var DEV_PORT = process.env.DEV_PORT || (process.env.DEV_PORT = 8080)

gulp.task('server', [
  'clean',
  'copy'
], function (done) {
  // Compilation watch tasks.
  gulp.watch('assets/**/*', ['copy:assets'])

  var server = new WebpackDevServer(webpack({
    devPort: DEV_PORT,
    production: false
  }), {
    contentBase: join(__dirname, '../build'),
    hot: true,
    filename: 'bundle.js',
    publicPath: '/js/',
    watchDelay: 300,
    stats: {
      colors: true,
      hash: false,
      chunks: false
    }
  })

  var app = require('../')

  app.listen(PORT, function (err) {
    return err ? done(err) : server.listen(DEV_PORT, '0.0.0.0', done)
  })
})
