// -------------------------------------------------------------
import gulp from 'gulp'
import fs from 'fs'
import clean from 'gulp-clean'


// HTML
import fileInclude from 'gulp-file-include'
import cleanHtml from 'gulp-htmlclean'

// SASS
import sassGlob from 'gulp-sass-glob'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'

// CSS
import cssMin from 'gulp-clean-css'
import groupMedia from 'gulp-group-css-media-queries'
import autoprefixer from 'gulp-autoprefixer'

// JS
import webpack from 'webpack-stream'
import { webpackConfigProd } from '../webpack.config.js'

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

const autoprefixerSettings = { overrideBrowserslist: ['last 10 versions'] }
const sass = gulpSass(dartSass)

const browserSyncSettings = {
  server: {
    baseDir: './dist'
  },
  open: false,
  notify: false
}

// -------------------------------------------------------------

// HTML
export function html () {
  return gulp
    .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
    .pipe(plumber(plumberConfig('HTML')))
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(cleanHtml())
    .pipe(gulp.dest('./dist/'))
}

// SCSS
export function scss () {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(plumber(plumberConfig('SCSS')))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(groupMedia())
    .pipe(cssMin())
    .pipe(autoprefixer(autoprefixerSettings))
    .pipe(gulp.dest('./dist/css/'))
}

// JS
export function js () {
  return gulp
    .src('./src/js/*.js')
    .pipe(plumber(plumberConfig('JS')))
    .pipe(webpack(webpackConfigProd))
    .pipe(gulp.dest('./dist/js/'))
}

// Перенос картинок
export function img () {
  return gulp
    .src('./src/img/**/*')
    .pipe(changed('./dist/img'))
    .pipe(gulp.dest('./dist/img'))
}

// Перенос файлов
export function files () {
  return gulp
    .src('./src/files/**/*')
    .pipe(changed('./dist/files'))
    .pipe(gulp.dest('./dist/files'))
}

// Перенос шрифтов
export function fonts () {
  return gulp
    .src('./src/fonts/**/*')
    .pipe(changed('./dist/fonts'))
    .pipe(gulp.dest('./dist/fonts'))
}

// "Сервер"
export function serv () {
  browser.init(browserSyncSettings)
}

// Удаление папки dist
export function cleanDist (done) {
  if (fs.existsSync('./dist/')) {
    return gulp.src('./dist/', { read: false }).pipe(clean())
  }
  done()
}
