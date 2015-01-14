'use strict';
/* global require */

var gulp = require('gulp');
var plug = require('gulp-load-plugins')({lazy: false});

gulp.task('build', function () {
    return gulp.src(['src/module.js', 'src/*.js'])
        .pipe(plug.jshint())
        .pipe(plug.jscs())
        .pipe(plug.ngAnnotate({
            remove: true,
            add: true,
            /* jshint ignore:start */
            single_quotes: true
            /* jshint ignore:end */
        }))
        .pipe(plug.concat('ngModal.js', {newLine: ';'}))
        .pipe(gulp.dest('./build/'))
        .pipe(plug.rename("mgModal.min.js"))
        .pipe(plug.uglify({mangle: true}))
        .pipe(gulp.dest('./build/'));
});
