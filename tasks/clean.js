var rimraf = require('rimraf')
var gulp = require('gulp')

gulp.task('clean', function () {
  rimraf.sync('build')
})
