var gulp    = require('gulp'),
    gutil    = require('gulp-util'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat'),
    react = require('gulp-react');

var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var revappend = require('gulp-rev-append');
var gulpif = require('gulp-if');
var useref = require('gulp-useref');
var rename = require('gulp-rename');
var shell = require('gulp-shell');
var exec = require('child_process').exec;
var recursive = require('recursive-readdir');
var del = require('del');
var electron = require('gulp-electron');
var argv = require('yargs').argv;

var config = {
    paths: {
        indexhtml: {
            src: ['src/index.html'],
            dest: 'dist',
            destfull: 'dist/index.html'
        },
        imgs: {
            src: ['src/imgs/**/*'],
            dest: 'dist/imgs'
        },
        css: {
            src: ['src/css/**/*.css'],
        },
        js: {
            src: [
                'src/js/*.js',
                '!src/js/jsx.js',
                '!src/js/JSXTransformer-modified-for-requirejxs.js'
            ],
            dest: 'dist/js'
        },
        jslibs: {
            src:  ['src/js/libs/**/*.js'],
            dest: 'dist/js/libs'
        },
        jsxcomponents: {
            src: ['src/js/components/**/*.js'],
            dest: 'dist/js/components'
        }
    }
}




gulp.task("index:html", ['index:init'], function(){
    return gulp.src(config.paths.indexhtml.destfull)
        .pipe(replace('js/commons.js', 'js/commons.js?rev=@@hash'))
        .pipe(replace('css/commons.css', 'css/commons.css?rev=@@hash'))
        .pipe(replace('<!--<script src="js/main-built.js"></script>-->', '<script src="js/main-built.js?rev=@@hash"></script>'))
        .pipe(gulp.dest(config.paths.indexhtml.dest))
        .pipe(revappend())
        .pipe(gulp.dest(config.paths.indexhtml.dest));
});




/**
 * We need to set uglify to ascii_only because tinymce has problem with Regex
 * But if we use this, the unicode of string will be replace, so, use with caution
 */
gulp.task("index:init", function(){
    return gulp.src(config.paths.indexhtml.src)
        .pipe(useref())
        .pipe(gulpif('*.js', uglify({output: {ascii_only: true}}))) //Very SLOW here
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(replace('/imgs/', '../imgs/'))
        .pipe(gulp.dest(config.paths.indexhtml.dest));
});





gulp.task("imgs", function(){
    return gulp.src(config.paths.imgs.src)
        .pipe(gulp.dest(config.paths.imgs.dest));
});



gulp.task("js", function(){
    return gulp.src(config.paths.js.src)
        .pipe(gulpif(argv.min, uglify()))
        .pipe(replace(/jsx!/g, ''))//remove jsx! in react source, do not use jsxcompiler in production
        .pipe(gulp.dest(config.paths.js.dest));
});


/* ---------------------------------------------------------------------*/
/* ---------------------------------------------------------------------*/
/* HELPERS SUB TASK FOR "MAIN" TASK, USED FOR PROJECTED BASE COMPONENTS */


gulp.task("js:libs", function(){
    return gulp.src(config.paths.jslibs.src)
        .pipe(gulpif(argv.min, uglify()))
        .pipe(gulp.dest(config.paths.jslibs.dest));
});


gulp.task("jsx:components", function(){
    return gulp.src(config.paths.jsxcomponents.src)
        .pipe(react({
            extension: 'js'
        }).on('error', function(e){console.log(e)}))
        .pipe(gulpif(argv.min, uglify()))
        .pipe(replace(/jsx!/g, ''))
        .pipe(gulp.dest(config.paths.jsxcomponents.dest));
});




gulp.task("optimizer:fetchallmodule", [
        'js',
        'js:libs',
        'jsx:components'
    ],
    function(){

    var rootdir = 'dist/js/';

    var modules = [
        'components'
    ];

    var itemModuleList = ["'main'", "'requireLib'"];

    var walkSync = function(dir, filelist) {

        if( dir[dir.length-1] != '/') dir=dir.concat('/')

        var fs = fs || require('fs'),
            files = fs.readdirSync(dir);
        filelist = filelist || [];
        files.forEach(function(file) {
            if (fs.statSync(dir + file).isDirectory()) {
                filelist = walkSync(dir + file + '/', filelist);
            }
            else {
                filelist.push(dir+file);
            }
        });
        return filelist;
    };

    //in building process, we need to ignore some files
    //put it here
    var ignoreList = [

    ];

    for (var i = 0; i < modules.length; i++) {
        var files = walkSync(rootdir + modules[i]);
        for (var j = 0; j < files.length; j++) {
            var file = files[j].replace(rootdir, '').replace('.js', '');

            if (ignoreList.indexOf(file) == -1) {
                itemModuleList.push("'" + file + "'");
            }

        }
    }


    return gulp.src('build.js')
        .pipe(replace("include: ['main', 'requireLib'],", "include: [" + itemModuleList.join(',') + "],"))
        .pipe(gulpif(argv.min, replace("optimize: 'none'", "optimize: 'uglify'")))
        .pipe(gulp.dest('dist'));
});



// Run the r.js command, so simple taks :)
gulp.task('requirejsoptimizer', ['optimizer:fetchallmodule'], function(cb){
    exec('r.js -o dist/build.js', {maxBuffer : 5000000 * 1024}, function (err, stdout, stderr) {
        console.log(stderr);
        cb(err);
    });
});

gulp.task("optimizer:finalize", ['requirejsoptimizer'], function(){
    return gulp.src(config.paths.indexhtml.destfull)
        .pipe(replace(/main-built\.js[^"]+/, "main-built.js?rev=@@hash"))
        .pipe(revappend())
        .pipe(gulp.dest(config.paths.indexhtml.dest));
});

// Run this task for update requirejs and react component relateds
gulp.task("main", ['optimizer:finalize'], function(){
    return del([
        'dist/js/components',
        'dist/js/libs',
        'dist/build.js'
    ]);
});




//////////////////////////////////////////////////////////////////////////////////////////
// Default task will be used to create 'dist' for release

//Process all non-app script (commonjs, commoncss). This task need to run after task 'main' so that the main-build file must be
gulp.task('default', [
    'imgs',
    'index:html'
]);



