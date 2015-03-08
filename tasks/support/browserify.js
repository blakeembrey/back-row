var gulp = require('gulp')
var join = require('path').join
var watchify = require('watchify')
var browserify = require('browserify')
var livereload = require('gulp-livereload')
var duration = require('gulp-duration')
var source = require('vinyl-source-stream')
var envify = require('envify/custom')

/**
 * Create a browserify build instance.
 *
 * @param  {Boolean} watch
 * @return {Object}
 */
module.exports = function (watch) {
  var build = browserify({
    entries: ['./app/js/main.js'],
    debug: true,
    // Required for watchify.
    cache: {},
    packageCache: {},
    fullPaths: watch
  })

  build.transform(envify({
    TRAKT_TV_CLIENT_ID: process.env.TRAKT_TV_CLIENT_ID,
    TRAKT_TV_CLIENT_SECRET: process.env.TRAKT_TV_CLIENT_SECRET
  }))

  build.plugin('minifyify', {
    map: 'bundle.map.json',
    output: join(__dirname, '../../build/js/bundle.map.json'),
    compressPath: 'back-row'
  })

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
        console.log(err && err.stack || err)

        this.emit('end')
      })
      .pipe(source('bundle.js'))
      .pipe(duration('browserify'))
      .pipe(gulp.dest('./build/js/'))
      .pipe(livereload())
  }

  return bundle()
}
