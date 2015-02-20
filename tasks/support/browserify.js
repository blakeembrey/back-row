var gulp = require('gulp')
var gutil = require('gulp-util')
var watchify = require('watchify')
var browserify = require('browserify')
var connect = require('gulp-connect')
var duration = require('gulp-duration')
var source = require('vinyl-source-stream')

/**
 * Create a browserify build instance.
 *
 * @param  {Boolean} watch
 * @return {Object}
 */
module.exports = function (watch) {
  var build = browserify({
    entries: ['./app/js/main.js'],
    debug:   gutil.env.type !== 'production',
    // Required for watchify.
    cache:        {},
    packageCache: {},
    fullPaths:    watch
  })

  // Enable `watchify` for rebuilds.
  if (watch) {
    build = watchify(build)

    build.on('update', bundle)
  }

  /**
   * Generate a built browserify bundle.
   */
  function bundle () {
    return build.bundle()
      .on('error', function (err) {
        gutil.log(err.message)
      })
      .pipe(source('bundle.js'))
      .pipe(duration('browserify'))
      .pipe(gulp.dest('./build/js/'))
      .pipe(connect.reload())
  }

  return bundle()
}
