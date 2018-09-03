var parallel = require('concurrent-transform')
var os = require('os')
const gulp = require('gulp')

const serve = require('gulp-serve')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const minify = require('gulp-babel-minify')
const imageResize = require('gulp-image-resize')
const imageMin = require('gulp-imagemin')

const src = './src'
const dist = './dist'

gulp.task('html', () => {
  return gulp.src(src + '/**/*.html').pipe(gulp.dest(dist))
})

gulp.task('js', () => {
  return gulp
    .src(src + '/js/index.js')
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat('index.js'))
    .pipe(minify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist + '/js'))
})

gulp.task('css', () => {
  return gulp
    .src(src + '/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('index.css'))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist + '/css'))
})

gulp.task('images', () => {
  return gulp
    .src('src/**/*.{jpg,png}')
    .pipe(parallel(imageResize({ width: 1200, height: 800 }), os.cpus().length))
    .pipe(parallel(imageMin(), os.cpus().length))
    .pipe(gulp.dest(dist + '/statics'))
})

gulp.task(
  'serve',
  serve({
    root: dist,
    port: 3000
  })
)

gulp.task(
  'dev',
  gulp.parallel('serve', 'html', 'css', 'js', () => {
    gulp.watch(src + '/**/*.html', gulp.series('html'))
    gulp.watch(src + '/**/*.css', gulp.series('css'))
    gulp.watch(src + '/js/index.js', gulp.series('js'))
  })
)
