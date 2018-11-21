const gulp = require('gulp'),
autoprefixer = require('gulp-autoprefixer'),
concat = require('gulp-concat');
sass = require('gulp-sass'),
browserSync = require('browser-sync').create();
responsive = require('gulp-responsive');
imgMin = require('gulp-imagemin');

gulp.task('js', () => {
  gulp.src('./src/**/*.js')
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('./public/js/'));
});

gulp.task('js:libs', () => {
  gulp.src('./node_modules/tiny-slider/dist/min/tiny-slider.js')
  .pipe(concat('libs.js'))
  .pipe(gulp.dest('./public/js/'));
});

gulp.task('css:libs', () => {
  gulp.src('./node_modules/tiny-slider/dist/tiny-slider.css')
  .pipe(concat('libs.css'))
  .pipe(gulp.dest('./public/css/'));
});

gulp.task('scss', () => {
  gulp.src('./src/index.scss')
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
  gulp.src('./src/service-worker.js')
  .pipe(gulp.dest('./public/'));
});

gulp.task('img', () => {
  gulp.src('./src/img/*.*')
  .pipe(imgMin())
  .pipe(gulp.dest('./public/img/'));
});

gulp.task('default', ['css:libs', 'scss', 'js:libs', 'js', 'img', 'html', 'manifest', 'serviceworker'], () => {
  browserSync.init({server: "./public/"});

  gulp.watch("./src/**/*.js", ['js']);
  gulp.watch("./src/**/*.scss", ['scss']);
  gulp.watch("./src/*.html", ['html']);
  gulp.watch("./src/img/*.*", ['img']);

  gulp.watch("./public/**/*.*").on('change', browserSync.reload);
});
