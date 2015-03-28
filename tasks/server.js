var gulp = require('gulp')
var join = require('path').join
var express = require('express')
var WebpackDevServer = require('webpack-dev-server')
var webpack = require('./support/webpack')
var PORT = process.env.PORT || 3000

gulp.task('server', ['copy'], function (done) {
  gulp.watch('assets/**/*', ['copy:assets'])

  var server = new WebpackDevServer(webpack(true), {
    contentBase: join(__dirname, '../build'),
    hot: true,
    filename: 'bundle.js',
    publicPath: '/js/',
    watchDelay: 300,
    stats: {
      colors: true
    }
  })

  server.app.use(require('../server'))

  server.listen(PORT, '0.0.0.0', done)
})
