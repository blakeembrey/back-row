var gulp = require('gulp')
var browserify = require('./support/browserify')

gulp.task('browserify', function () {
  return browserify()
})
