var gulp = require('gulp')
var join = require('path').join

gulp.task('copy:videojs', function () {
  return gulp.src(join(__dirname, '../node_modules/video.js/dist/video-js/**/*'))
    .pipe(gulp.dest('build/vendor/videojs'))
})

gulp.task('copy:normalize', function () {
  return gulp.src(join(__dirname, '../node_modules/normalize.css/normalize.css'))
    .pipe(gulp.dest('build/vendor/normalize'))
})

gulp.task('copy:font-awesome', function () {
  return gulp.src(join(__dirname, '../node_modules/font-awesome/{css,fonts}/**/*'))
    .pipe(gulp.dest('build/vendor/font-awesome'))
})

gulp.task('copy:assets', function () {
  return gulp.src('assets/**/*')
    .pipe(gulp.dest('build/'))
})

gulp.task('copy:vendor', ['copy:videojs', 'copy:normalize', 'copy:font-awesome'])

gulp.task('copy', ['copy:vendor', 'copy:assets'])
