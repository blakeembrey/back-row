var gulp = require('gulp')
var express = require('express')
var PORT = process.env.PORT || 3000

gulp.task('server', function (done) {
  var app = express()

  app.use(require('connect-livereload')())
  app.use(require('../'))

  app.listen(PORT, done)
})
