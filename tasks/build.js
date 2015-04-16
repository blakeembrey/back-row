var gulp = require('gulp')
var webpack = require('./support/webpack')

gulp.task('build', [
  'clean',
  'copy'
], function (done) {
  return webpack({
    production: true
  }).run(function (err, stats) {
    if (!err) {
      console.log(stats.toString({
        colors: true,
        hash: false,
        chunks: false
      }))
    }

    return done(err)
  })
})
