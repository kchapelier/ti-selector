var gulp = require('gulp'),
    concat = require('gulp-concat-util'),
    fs = require('fs');

gulp.task('build', function() {
    gulp
        .src([
            './src/lib/operands.js', './src/lib/iterator.js', './src/lib/query-parser.js', './src/lib/selector.js',
            './src/index.js'
        ])
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
        .pipe(concat.header(fs.readFileSync('./build-templates/header')))
        .pipe(concat.footer(fs.readFileSync('./build-templates/footer')))
        .pipe(gulp.dest('./build'));
});