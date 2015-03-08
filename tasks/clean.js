var rimraf = require('rimraf')
var gulp = require('gulp')

gulp.task('clean:vendor', function (done) {
  rimraf('build/vendor', done)
})

gulp.task('clean:assets', function (done) {
  rimraf('build/index.html', done)
})

gulp.task('clean', function (done) {
  rimraf('build', done)
})
