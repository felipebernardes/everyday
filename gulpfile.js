const gulp = require('gulp'),
autoprefixer = require('gulp-autoprefixer'),
concat = require('gulp-concat');
sass = require('gulp-sass'),
browserSync = require('browser-sync').create();
responsive = require('gulp-responsive');
imgMin = require('gulp-imagemin');

gulp.task('js', () => {
  gulp.src('./src/js/*.js')
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('./public/js/'));
});

gulp.task('scss', () => {
  gulp.src('./src/scss/style.scss')
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(autoprefixer({browsers: ['last 10 versions'], cascade: false}))
  .pipe(gulp.dest('./public/css/'));
});

gulp.task('html', () => {
  gulp.src('./src/*.html')
  .pipe(gulp.dest('./public/'));
});

gulp.task('manifest', () => {
  gulp.src('./src/manifest.json')
  .pipe(gulp.dest('./public/'));
});

gulp.task('serviceworker', () => {
  gulp.src('./src/sw.js')
  .pipe(gulp.dest('./public/'));
});

gulp.task('img', () => {
  gulp.src('./src/img/*.*')
  .pipe(imgMin())
  .pipe(gulp.dest('./public/img/'));
});

gulp.task('fonts', () => {
  gulp.src('./src/fonts/*.*')
  .pipe(gulp.dest('./public/fonts/'));
});

gulp.task('default', ['scss', 'js', 'img', 'html', 'fonts', 'manifest', 'serviceworker'], () => {
  browserSync.init({server: "./public/"});

  gulp.watch("./src/js/**/*.js", ['js']);
  gulp.watch("./src/scss/**/*.scss", ['scss']);
  gulp.watch("./src/*.html", ['html']);
  gulp.watch("./src/img/*.*", ['img']);

  gulp.watch("./public/**/*.*").on('change', browserSync.reload);
});
