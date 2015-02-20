var gulp = require('gulp')

gulp.task('build', [
  'clean',
  'copy',
  'browserify'
])
