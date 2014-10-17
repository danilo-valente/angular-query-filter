var gulp = require('gulp');
var rename = require('gulp-rename');
var jison = require('gulp-jison');
var jisonLex = require('gulp-jison-lex');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var beautify = require('gulp-beautify');
var uglify = require('gulp-uglify');
var karma = require('karma').server;

var PATH = {
    src: 'src',
    release: 'release',
    tmp: '.tmp',
    grammar: 'grammar'
};

var PROJECT = require('./bower');

gulp.task('jisonlex', function () {
    return gulp.src(PATH.src + '/' + PATH.grammar + '/**.jisonlex')
        .pipe(jisonLex({
            outFile: '<%= path.basename %>.js',
            moduleName: '<%= path.basename %>Lexer',
            moduleType: 'js'
        }))
        .pipe(gulp.dest(PATH.tmp + '/' + PATH.grammar));
});

gulp.task('jison', function () {
    return gulp.src(PATH.src + '/parser.jison')
        .pipe(jison({
            moduleName: 'ParserFactory',
            moduleType: 'js'
        }))
        .pipe(gulp.dest(PATH.tmp));
});

gulp.task('concat', function () {

    return gulp.src([
        PATH.src + '/vars.js',
        PATH.src + '/ast.js',
        PATH.tmp + '/grammar/*.js',
        PATH.tmp + '/parser.js',
        PATH.src + '/filter.js'
    ])
        .pipe(concat(PROJECT.name + '.js'))
        .pipe(wrap({
            src: PATH.src + '/module.template'
        }, PROJECT, {
            variable: 'project'
        }))
        .pipe(beautify())
        .pipe(gulp.dest(PATH.release));
});

gulp.task('minify', function () {
    return gulp.src(PATH.release + '/' + PROJECT.name + '.js')
        .pipe(rename(PROJECT.name + '.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(PATH.release));
});

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/test/karma.conf.js',
        singleRun: true
    }, done);
});

// TODO: Add 'bump' task