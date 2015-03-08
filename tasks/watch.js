var gulp = require('gulp')
var livereload = require('gulp-livereload')
var browserify = require('./support/browserify')

gulp.task('watch', ['copy', 'server'], function () {
  gulp.watch('app/**/*.{css,html}', ['copy'])

  livereload.listen()

  return browserify(true)
})
