var gulp = require('gulp')
var join = require('path').join
var livereload = require('gulp-livereload')

gulp.task('copy:videojs', ['clean:vendor'], function () {
  return gulp.src(join(__dirname, '../node_modules/video.js/dist/video-js/**/*'))
    .pipe(gulp.dest('build/vendor/videojs'))
    .pipe(livereload())
})

gulp.task('copy:normalize', ['clean:vendor'], function () {
  return gulp.src(join(__dirname, '../node_modules/normalize.css/normalize.css'))
    .pipe(gulp.dest('build/vendor/normalize'))
    .pipe(livereload())
})

gulp.task('copy:assets', ['clean:assets'], function () {
  return gulp.src('assets/**/*')
    .pipe(gulp.dest('build/'))
    .pipe(livereload())
})

gulp.task('copy', [
  'copy:videojs',
  'copy:normalize',
  'copy:assets'
])
