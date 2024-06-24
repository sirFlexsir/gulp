// -------------------------------------------------------------
import gulp from 'gulp'
import fs from 'fs'
import clean from 'gulp-clean'

// HTML
import fileInclude from 'gulp-file-include'

// SASS
import sassGlob from 'gulp-sass-glob'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'

import sourceMaps from 'gulp-sourcemaps'

// CSS
import groupMedia from 'gulp-group-css-media-queries'

// JS
import webpack from 'webpack-stream'
import { webpackConfigDev } from '../webpack.config.js'

import plumber from 'gulp-plumber'
import notify from 'gulp-notify'

import changed, { compareContents } from 'gulp-changed'
import browser from 'browser-sync'

// -------------------------------------------------------------
// CONFIG

const fileIncludeSettings = {
  prefix: '@@',
  basepath: '@file'
}

const plumberConfig = (title) => ({
  errorHandler: notify.onError({
    title,
    message: 'Error <%= error.message %>',
    sound: false
  })
})

const sass = gulpSass(dartSass)

const browserSyncSettings = {
  server: {
    baseDir: './build'
  },
  open: false,
  notify: false
}

// -------------------------------------------------------------

// HTML
export function html () {
  return gulp
    .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
    .pipe(changed('./build/', { hasChanged: compareContents }))
    .pipe(plumber(plumberConfig('HTML')))
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(gulp.dest('./build/'))
    .pipe(browser.stream())
}

// SCSS
export function scss () {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(changed('./build/css/'))
    .pipe(plumber(plumberConfig('SCSS')))
    .pipe(sourceMaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(groupMedia())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./build/css/'))
    .pipe(browser.stream())
}

// JS
export function js () {
  return gulp
    .src('./src/js/*.js')
    .pipe(changed('./build/js/'))
    .pipe(plumber(plumberConfig('JS')))
    .pipe(webpack(webpackConfigDev))
    .pipe(gulp.dest('./build/js/'))
    .pipe(browser.stream())
}

// Перенос картинок
export function img () {
  return gulp
    .src('./src/img/**/*')
    .pipe(changed('./build/img'))
    .pipe(gulp.dest('./build/img'))
}

// Перенос файлов
export function files () {
  return gulp
    .src('./src/files/**/*')
    .pipe(changed('./build/files'))
    .pipe(gulp.dest('./build/files'))
}

// Перенос шрифтов
export function fonts () {
  return gulp
    .src('./src/fonts/**/*')
    .pipe(changed('./build/fonts'))
    .pipe(gulp.dest('./build/fonts'))
}

export function serv () {
  browser.init(browserSyncSettings)
}

// Удаление папки build
export function cleanDist (done) {
  if (fs.existsSync('./build/')) {
    return gulp.src('./build/', { read: false }).pipe(clean())
  }
  done()
}

// Отслеживание изменений
export function watch () {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel(scss))
  gulp.watch('./src/**/*.html', gulp.parallel(html))
  gulp.watch('./src/img/**/*', gulp.parallel(img))
  gulp.watch('./src/files/**/*', gulp.parallel(files))
  gulp.watch('./src/fonts/*', gulp.parallel(fonts))
  gulp.watch('./src/js/**/*.js', gulp.parallel(js))
}
