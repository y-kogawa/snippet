var gulp        = require('gulp');
var compass     = require('gulp-compass');
var livereload  = require('gulp-livereload');
var plumber     = require('gulp-plumber');

var SCSS_FILE   = 'httpdocs/sass/**/*.scss';
var WATCH_FILE  = [
                    'httpdocs/**/*.html',
                    'httpdocs/**/*.js'
                    ];

/*
 * Compass
 */
gulp.task('compass',function(){
    gulp.src(SCSS_FILE)
        .pipe(plumber())
        .pipe(compass({
            config_file : 'config.rb',
            comments : false,
            css : 'httpdocs/css/',
            sass: 'httpdocs/sass/'
        }))
        .pipe(livereload());
});

/*
 * Watch
 */
gulp.task('watch',function(){
    gulp.watch(SCSS_FILE, function(event){
        gulp.run('compass');
    });

    gulp.watch(WATCH_FILE, function(){
        gulp.src(WATCH_FILE)
            .pipe(livereload());
    });
});

gulp.task('default', ['watch']);