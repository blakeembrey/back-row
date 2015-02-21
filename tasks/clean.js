var rimraf = require('rimraf')
var gulp = require('gulp')

gulp.task('clean', function (done) {
  rimraf('build', done)
})
