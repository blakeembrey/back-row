var gulp = require('gulp')
var connect = require('gulp-connect')
var PORT = process.env.PORT || 3000

gulp.task('server', ['watch'], server)

function server () {
  connect.server({
    root: 'build',
    port: PORT,
    livereload: true,
    middleware: function(connect, opt) {
      return [
        require('../server')
      ]
    }
  })
}
