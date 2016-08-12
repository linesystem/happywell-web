var gulp        = require('gulp')
var scp         = require('gulp-scp2')
var babel       = require('gulp-babel')
var uglify      = require('gulp-uglify')
var gutil       = require('gulp-util')
var browserify  = require('browserify')
var sourcemaps  = require('gulp-sourcemaps')
var source      = require('vinyl-source-stream')
var buffer      = require('vinyl-buffer')
var babelify    = require('babelify')
var resolve     = require('resolve')

const ASSETS        = ['**/*', '!node_modules/**/*', '!**/*.js']
const SERVER_SRC    = ['./server/**/*.js']
const SERVER_DEST   = './dist'
const APP_ENTRY     = 'client/index.js'
const LOG_ENTRY     = 'client/log.js'
const CLIENT_SRC    = ['./client/**/*.js']
const CLIENT_DEST   = './dist/assets/js'
const SCP_SRC       = ['**/*', '!node_modules/**/*', '!dist/**/*', 'index.html']
const SCP_DEST      = '/home/happywell/happywell-web'
const VENDORS = [
  'react',
  'react-dom',
  'lodash',
  'redux',
  'react-redux',
  'redux-thunk',
  'isomorphic-fetch',
  'es6-promise',
  'redux-logger',
  'socket.io-client',
  'react-router',
  'react-modal',
  'react-infinite',
  'envify',
  'react-select',
  'react-sortable'
]
const SCP_OPTIONS = {
  host: '1.234.146.132',
  username: process.env.HAPPYWELL_ID,
  password: process.env.HAPPYWELL_PWD,
  dest: SCP_DEST,
  watch: function(client) {
    client.on('write', function(o) {
      console.log('write %s', o.destination)
    })
  }
}

gulp.task('build-server', function() {
  gulp.src(SERVER_SRC)
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest(SERVER_DEST))
})

gulp.task('build-client', ['build-vendor', 'build-app', 'build-log'], function () { })
gulp.task('build-vendor', function () {
  var b = browserify({
    transform: [babelify.configure({presets: ["es2015", "react"]})]
  })
  VENDORS.forEach(function (lib) {
    b.require(resolve.sync(lib), { expose: lib })
  })
  return b
    .bundle()
    .on('error', gutil.log)
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(CLIENT_DEST))
})

gulp.task('build-app', function () {
  var b = browserify({
    entries: APP_ENTRY,
    transform: [babelify.configure({presets: ["es2015", "react"]})]
  })
  VENDORS.forEach(function(lib) {
    b.external(lib)
  })
  return b
    .bundle()
    .on('error', gutil.log)
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(CLIENT_DEST))
})

gulp.task('build-log', function () {
  var b = browserify({
    entries: LOG_ENTRY,
    transform: [babelify.configure({presets: ["es2015", "react"]})]
  })
  VENDORS.forEach(function(lib) {
    b.external(lib)
  })
  return b
    .bundle()
    .on('error', gutil.log)
    .pipe(source('log.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(CLIENT_DEST))
})

gulp.task('build', ['build-server', 'build-app', 'build-log'], function(){
  gulp.watch('.transfer', ['build-server', 'build-app', 'build-log'])
})

gulp.task('transfer', ['scp'], function() {
  return gulp.src('.transfer', {cwd: __dirname})
  .pipe(scp(SCP_OPTIONS))
  .on('error', function(err) {
    console.log(err)
  })
})

gulp.task('scp', function() {
  return gulp.src(SCP_SRC, {cwd: __dirname})
  .pipe(scp(SCP_OPTIONS))
  .on('error', function(err) {
    console.log(err)
  })
})

gulp.task('scp-assets', function() {
  return gulp.src(ASSETS, {cwd: __dirname})
  .pipe(scp(SCP_OPTIONS))
  .on('error', function(err) {
    console.log(err)
  })
})

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('gulpfile.js', ['transfer'])
  gulp.watch('package.json', ['transfer'])
  gulp.watch(ASSETS, ['scp-assets'])
  gulp.watch(SERVER_SRC, ['transfer'])
  gulp.watch(CLIENT_SRC, ['transfer'])
})

gulp.task('default', ['transfer', 'scp-assets', 'watch'])
