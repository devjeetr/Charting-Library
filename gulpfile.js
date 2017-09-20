
'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sourceMaps = require('gulp-sourcemaps'),
    duration = require('gulp-duration'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    watchify = require('watchify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    glob = require('glob'),
    eslint = require('gulp-eslint'),
    path = require('path');

var config = {
    js: {
        entryPoint: './src/js/index.js',
        watch: './src/js/**/*.js',
        outputName: 'App.js',
        outputDir: './dist/',
        srcName: 'App.js',
        srcMapDir: './dist/srcMaps'
    },
    sass: {
        files: './src/sass/*.scss',
        outputDir: './dist/css/'
    },
    html: {
        files: './dist/*.html'
    }
};


// lint javascript
gulp.task('lint', function () {

    return gulp.src(config.js.watch).pipe(eslint({
            'rules': {
                'quotes': [1, 'single'],
                'semi': [1, 'always']
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});



// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src(config.sass.files)
        .pipe(sass())
        .pipe(gulp.dest(config.sass.outputDir))
        .pipe(browserSync.stream());
});


// bundle source js files
function transpileSource(bundler) {
    var timer = duration('Time Taken To Bundle');

    return bundler.bundle()
        .on('error', function (err) {
            browserSync.notify("Error");
            gutil.log(err);
        })
        .pipe(source(config.js.srcName))
        .pipe(buffer())
        .pipe(rename(config.js.outputName))
        .pipe(gulp.dest(config.js.outputDir))
        .pipe(timer)
        .pipe(reload({
            stream: true
        }));
}

// Bundle all source into a single file: browserify
gulp.task('bundleSource', function () {
    var bundler = browserify(config.js.entryPoint, Object.assign(watchify.args, {debug: true}))
                .transform(babelify, {presets: ['react', 'es2015'], sourceMaps: true})
                .plugin(watchify);

    bundler.on('update', function () {
        transpileSource(bundler);
    })
    return transpileSource(bundler);

});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['sass', 'bundleSource'], function () {

    browserSync.init({
        server: './dist',
        // proxy: '0.0.0.0:5000',
        debug: true,
        index: 'index.html'
    });
    // Serve files from the root of this project
    gulp.watch(config.sass.files, ['sass']);
    gulp.watch(config.html.files).on('change', reload);
});

gulp.task('build', ['bundleSource', 'sass']);
