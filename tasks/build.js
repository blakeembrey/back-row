var gulp = require('gulp')
var webpack = require('./support/webpack')

gulp.task('build', [
  'clean',
  'copy'
], function (done) {
  return webpack().run(function (err, stats) {
    console.log(stats.toString())

    return done(err)
  })
})
