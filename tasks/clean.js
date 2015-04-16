var del = require('del')
var gulp = require('gulp')

gulp.task('clean', function () {
  del.sync('build')
})
