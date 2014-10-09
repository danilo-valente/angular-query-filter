var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var shell = require('gulp-shell');
var jison = require('gulp-jison');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var beautify = require('gulp-beautify');
var uglify = require('gulp-uglify');
var karma = require('karma').server;

var ENV = {
    src: 'src',
    release: 'release',
    tmp: '.tmp'
};

var PROJECT = require('./bower');

gulp.task('jison', function () {
    return gulp.src(ENV.src + '/parser.jison')
        .pipe(shell([
            'mkdir -p ' + ENV.tmp,
            'jison <%= file.path %> -o ' + ENV.tmp + '/parser.js -m js'
        ]));
});

gulp.task('concat', function () {

    return gulp.src([
        ENV.src + '/token.js',
        ENV.tmp + '/parser.js',
        ENV.src + '/filter.js'
    ])
        .pipe(concat(PROJECT.name + '.js'))
        .pipe(wrap({
            src: ENV.src + '/closure.template'
        }, PROJECT, {
            variable: 'project'
        }))
        .pipe(beautify())
        .pipe(gulp.dest(ENV.release));
});

gulp.task('minify', function () {
    return gulp.src(ENV.release + '/' + PROJECT.name + '.js')
        .pipe(rename(PROJECT.name + '.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(ENV.release));
});

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/test/karma.conf.js',
        singleRun: true
    }, done);
});

// TODO: Add 'bump' task

// gulp.task('build', gulpsync.sync(['jison', 'concat']));

// gulp.task('release', gulpsync.sync(['build', 'test']));