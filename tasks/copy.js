var gulp = require('gulp')
var join = require('path').join
var connect = require('gulp-connect')

gulp.task('copy:videojs', ['clean'], function () {
  return gulp.src(join(__dirname, '../node_modules/video.js/dist/video-js/**/*'))
    .pipe(gulp.dest('build/vendor/videojs'))
    .pipe(connect.reload())
})

gulp.task('copy:normalize', ['clean'], function () {
  return gulp.src(join(__dirname, '../node_modules/normalize.css/normalize.css'))
    .pipe(gulp.dest('build/vendor/normalize'))
    .pipe(connect.reload())
})

gulp.task('copy:assets', ['clean'], function () {
  return gulp.src('app/**/*.{css,html}')
    .pipe(gulp.dest('build/'))
    .pipe(connect.reload())
})

gulp.task('copy', [
  'copy:videojs',
  'copy:normalize',
  'copy:assets'
])
