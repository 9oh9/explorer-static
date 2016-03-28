var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var historyApiFallback = require('connect-history-api-fallback');

gulp.task('autoprefix', function(){
    return gulp.src('./src/css/*')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('transpile', function(){
    return gulp.src('./src/js/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./dist'));
});

gulp.task('connect', function(){

    connect.server({

        port: 8000,

        livereload: true,

        middleware: function(connect, opt){
            return [ historyApiFallback() ]
        }

    });

});

gulp.task('reload', function(){
  gulp.src(['./dist/*', './templates/*', './index.html'])
      .pipe(connect.reload());
});

gulp.task('watch', function(){
    gulp.watch(['./src/**/*', './src/css/*' , './templates/*', './index.html'], ['reload']);
});

gulp.task('default', ['connect', 'watch']);
