var rimraf = require('rimraf')
var gulp = require('gulp')

gulp.task('clean:vendor', function () {
  rimraf.sync('build/vendor')
})

gulp.task('clean:assets', function () {
  rimraf.sync('build/index.html')
})

gulp.task('clean', function () {
  rimraf.sync('build')
})
