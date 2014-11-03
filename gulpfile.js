var gulp = require('gulp'),
    concat = require('gulp-concat-util'),
    fs = require('fs'),
    jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    mocha = require('gulp-mocha'),
    sequence = require('run-sequence'),
    plato = require('gulp-plato');

var files = [
    './src/lib/operators.js', './src/lib/iterator.js', './src/lib/query-parser.js', './src/lib/selector.js',
    './src/index.js'
];

var createHeaderComment = function() {
    var info = require('./package.json'),
        comment;

    comment = '/**\n';
    comment+= ' * ' + info.name + '\n';
    comment+= ' * \n';
    comment+= ' * ' + info.description + '\n';
    comment+= ' * \n';
    comment+= ' * Author: ' + info.author + '\n';
    comment+= ' * Version: ' + info.version + '\n';
    comment+= ' * License: ' + info.license + '\n';
    comment+= ' * Repository: ' + info.repository.url + '\n';
    comment+= ' */\n\n';

    return comment;
};

gulp.task('report', function() {
    var jshintOptions = JSON.parse(fs.readFileSync('./.jshintrc'));

    return gulp
        .src(files)
        .pipe(plato('report', {
            jshint: {
                options: jshintOptions
            },
            complexity: {
                trycatch: true
            }
        }));
});

gulp.task('verify', function(callback) {
    sequence(
        'lint',
        'codestyle',
        'test',
        function(err) {
            if(!err) {
                callback.apply(null, arguments);
            }
        }
    );
});

gulp.task('lint', function() {
    return gulp
        .src(files)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(stylish));
});

gulp.task('codestyle', function() {
    return gulp
        .src(files)
        .pipe(jscs());
});

gulp.task('test', function() {
    return gulp
        .src([ './test/*.js' ])
        .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('build', function() {
    gulp
        .src(files)
        .pipe(concat('ti-selector.js', {
            process : function(src) {
                return src
                    // Remove the 'Submodules' block
                    .replace(/\/[\r\n]*\* Submodules \*\/[^]+\/\* Submodules end \*\/[\r\n]*/g, '')
                    // Remove all "use strict";
                    .replace(/[\r\n]*.*"use strict";?.*[\r\n]*/g, '\n')
                    // Remoe all module.exports
                    .replace(/[\r\n]*.*module.exports.*[\r\n]*/g, '\n')
                    // Add a tab at the beginning of every lines
                    .replace(/(^|\r*\n)/g, '\n    ')
                    // Remove orphan tabs and spaces
                    .replace(/\n[ /t]+(\n|$)/g, '\n\n');
            }
        }))
        .pipe(concat.header(createHeaderComment() + fs.readFileSync('./build-templates/header')))
        .pipe(concat.footer(fs.readFileSync('./build-templates/footer')))
        .pipe(gulp.dest('./build'));
});
