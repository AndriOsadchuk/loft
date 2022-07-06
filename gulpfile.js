const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const server = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const imageminJpegtran = require('imagemin-jpegtran');

gulp.task('css', () => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename({
      suffix: ".min",
    }))
    .pipe(gulp.dest("./build"))
    .pipe(server.stream());
});

gulp.task('html', () => {
  return gulp.src('./src/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./build'))
    .pipe(server.stream());
})

gulp.task('clean', function() {
  return del('./build')
});

gulp.task('server', () => {
  server.init({
   server: "./build/",
   notify: false,
   open: true,
   cors: true,
   ui: false 
  });

  gulp.watch('./src/scss/**/*.scss', gulp.series('css'))
  gulp.watch('./src/**/*.html', gulp.series('html'))
})

gulp.task('copy-images', () => {
  return gulp.src([
    './src/images/**/*.*'
  ])
  .pipe(gulp.dest('./build/images/'))
})

gulp.task('copy-fonts', () => {
  return gulp.src([
    './src/fonts/**/*.*'
  ])
  .pipe(gulp.dest('./build/fonts/'))
})

gulp.task('optimization-images', () => {
  return gulp.src('./build/images/**/*.*')
  .pipe(imagemin([
    imagemin.optipng({ optimizationLevel: 3 }),
    imagemin.svgo({ plugins: [ {cleanupIDs: false}] }),
    imageminJpegtran({ progressive: true })
  ]))
  .pipe(gulp.dest('./build/images'))
})

gulp.task("start", gulp.series('clean', 'html', 'css', 'copy-images', 'copy-fonts', 'server'))
gulp.task("finish", gulp.series('clean', 'html', 'css', 'copy-images', 'copy-fonts', 'optimization-images'))