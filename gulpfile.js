var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var clean = require('gulp-clean');
var shell = require('gulp-shell');
var jison = require('gulp-jison');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var browserify = require('gulp-browserify');

var fwrite = function (filename, contents) {
    var src = require('stream').Readable({ objectMode: true });
    src._read = function () {
        this.push(new gutil.File({
            cwd: '',
            base: '',
            path: filename,
            contents: new Buffer(contents)
        }));
        this.push(null);
    }
    return src;
};

var ENV = {
    src: 'src',
    release: 'release',
    tmp: '.tmp'
};

gulp.task('clean:tmp', function (target) {
    return gulp.src(ENV.tmp, { read: false })
        .pipe(clean());
});

gulp.task('clean:release', function (target) {
    return gulp.src(ENV.release, { read: false })
        .pipe(clean());
});

gulp.task('copy', function () {
    return gulp.src(ENV.src + '/*.js')
        .pipe(gulp.dest(ENV.tmp));
});

/*gulp.task('lexer', function () {
    return gulp.src(ENV.tmp + '/lexer.l')
        .pipe(shell([
                'mkdir -p ' + ENV.tmp,
                'jison-lex <%= file.path %> -o ' + ENV.tmp + '/lexer.js -t node'
        ]));
});

gulp.task('parser', function () {
    return gulp.src([ENV.tmp + '/parser.y'])
        .pipe(jison({ moduleType: 'node' }))
        .pipe(gulp.dest(ENV.tmp));
});

gulp.task('jison', function () {
    return gulp.src([ENV.src + '/parser.jison'])
        .pipe(jison({ moduleType: 'node' }))
        .pipe(gulp.dest(ENV.tmp));
});

gulp.task('release', function () {
    return gulp.src(ENV.tmp + '/index.js')
        .pipe(browserify({ insertGlobals: true }))
        //.pipe(wrap('<%= contents =%>'))
        .pipe(gulp.dest(ENV.release));
});*/

gulp.task('jison', function () {
    return gulp.src(ENV.src + '/parser.jison')
        .pipe(shell('jison <%= file.path %> -o ' + ENV.src + '/parser.js'));
});

gulp.task('build', gulpsync.sync(['jison']));