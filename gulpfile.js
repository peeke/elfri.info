const parallel = require('concurrent-transform')
const os = require('os')
const fs = require('fs')
const path = require('path')
const gulp = require('gulp')

const serve = require('gulp-serve')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const cleanCSS = require('gulp-clean-css')
// const babel = require('gulp-babel')
// const minify = require('gulp-babel-minify')
const rollup = require('gulp-better-rollup')
const babel = require('rollup-plugin-babel')
const imageResize = require('gulp-image-resize')
const imageMin = require('gulp-imagemin')
const nunjucksRender = require('gulp-nunjucks-render')
const data = require('gulp-data')
const ext = require('gulp-ext-replace')

const src = './src'
const dist = './dist'

gulp.task('html', () => {
  return gulp
    .src(src + '/**/*.njk')
    .pipe(
      data(file => {
        try {
          return JSON.parse(fs.readFileSync(file.path.replace('.njk', '.json')))
        } catch (e) {
          return {}
        }
      })
    )
    .pipe(
      nunjucksRender({
        path: src,
        ext: '.njk'
      })
    )
    .pipe(ext('.html'))
    .pipe(gulp.dest(dist))
})

gulp.task('js', () => {
  return (
    gulp
      .src(src + '/js/index.js')
      .pipe(sourcemaps.init())
      .pipe(
        rollup(
          {
            // There is no `input` option as rollup integrates into the gulp pipeline
            plugins: [
              babel({
                presets: ['@babel/env']
              })
            ]
          },
          {
            // Rollups `sourcemap` option is unsupported. Use `gulp-sourcemaps` plugin instead
            format: 'cjs'
          }
        )
      )
      // .pipe(minify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dist + '/js'))
  )
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
    .pipe(gulp.dest(dist))
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
    gulp.watch(src + '/**/*.njk', gulp.series('html'))
    gulp.watch(src + '/**/*.css', gulp.series('css'))
    gulp.watch(src + '/js/index.js', gulp.series('js'))
  })
)
