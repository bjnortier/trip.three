'use strict';

const gulp = require('gulp');
const path = require('path');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const babel = require('babel-register');

const srcFiles = path.join('src', '**', '*.js');
const unitTestFiles = path.join('test', 'unit', '**', '*.test.js');
const functionalTestFiles = path.join('test', 'functional', 'src', '*.js');

const allJSFiles = ['**/*.js','!node_modules/**'];

// ----- Individual Tasks -----

gulp.task('clearconsole', () => {
  process.stdout.write('\x1Bc');
});

gulp.task('lint', () => {
  return gulp.src(allJSFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('unit', [], () => {
  return gulp.src(unitTestFiles)
    .pipe(mocha({
      compilers: {
        js: babel,
      },
    }));
});

gulp.task('test', ['lint', 'unit']);

gulp.task('default', ['test']);

gulp.task('watch', () => {
  gulp.watch(allJSFiles, ['clearconsole', 'lint']);
  gulp.watch(srcFiles, ['clearconsole', 'lint', 'unit']);
  gulp.watch(unitTestFiles, ['clearconsole', 'lint', 'unit']);
  gulp.watch(functionalTestFiles, ['clearconsole', 'lint']);
});
