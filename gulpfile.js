'use strtict'
var gulp = require('gulp')
var browserSync = require('browser-sync').create()
var reload = browserSync.reload
var concat = require('gulp-concat')
var minify = require('gulp-minify')
var cleanCss = require('gulp-clean-css')
var rename = require('gulp-rename')
var htmlmin = require('gulp-htmlmin')
var del = require('del')
// var uncss = require('gulp-uncss')
var uglify = require('gulp-uglify')
var pump = require('pump')
var sass = require('gulp-sass');



gulp.task('sass', function () {
    return gulp.src(['./src/scss/*.scss', 'node_modules/bootstrap/scss/bootstrap.scss','node_modules/font-awesome/scss/font-awesome.scss'])
        .pipe(sass({ 
          errLogToConsole: true,
          sourceComments: true,
          includePaths: ['node_modules/bootstrap/scss','node_modules/font-awesome/scss']
        }).on('error', sass.logError))
        .pipe(gulp.dest('./src/css'))
        .pipe(browserSync.stream());
});


gulp.task('fonts', function() {
    return gulp.src(['node_modules/font-awesome/fonts/fontawesome-webfont.*'])
        .pipe(gulp.dest('src/fonts/'))
        .pipe(browserSync.stream());

});

gulp.task('js', function() {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/tether/dist/js/tether.min.js'])
        .pipe(gulp.dest("./src/js"))
        .pipe(browserSync.stream());
        
});  

// Default Gulp task to run including all necessary dependencies
gulp.task('default', ['browser-sync', 'build','fonts', 'sass', 'js'], function () {
  gulp.watch(['src/**/*.html', 'src/js/*.js',
    'src/css/*.css'
  ], ['build'])
  gulp.watch(['public/**/*.html', 'public/js/*.js',
    'public/css/*.css'
  ], reload)
})


gulp.task('browser-sync', function () {
  browserSync.init({
    server: './public'
  })
})


// Build task to initiate minify tasks for CSS and JS
gulp.task('build', [
    'minify-html', 'pack-minify-js', 'pack-minify-css','copy-img', 'copy-css', 'copy-js','copy-fonts','js','sass','fonts'
])

gulp.task('setup', ['build']);


// Task to minify HTML
gulp.task('minify-html', function () {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('public/'))
})

// Task to uglify JS
gulp.task('pack-minify-js', function (cb) {
  pump([
    gulp.src(['src/js/*.js', '!src/js/*.min.js'])
      .pipe(minify({
        ext: {
          min: '.min.js'
        },
        noSource: true
      })),
    uglify(),
    gulp.dest('./public/js')
  ],
    cb
  )
})

// Task to minify CSS
gulp.task('pack-minify-css', function () {
  return gulp.src(['src/css/*.css', '!src/css/*.min.css'])
    .pipe(concat('main.css'))
    .pipe(cleanCss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('public/css'))
})

// gulp.task('gulp-uncss', function () {
//   return gulp.src('./css/bootstrap-custom.css')
//     .pipe(uncss({
//       html: ['index.html'],
//       ignore: [/\modal/]
//     }))
//     .pipe(gulp.dest('public/css'))
// })


// // Task to copy assets
gulp.task('copy-img', function () {
  return gulp.src('src/assets/img/*')
    .pipe(gulp.dest('public/assets/img'))
})

gulp.task('copy-css', function () {
  return gulp.src('src/css/*.css')
    .pipe(gulp.dest('public/css'))
})

gulp.task('copy-js', function () {
  return gulp.src('src/js/*.js')
    .pipe(gulp.dest('public/js'))
})

gulp.task('copy-fonts', function () {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('public/fonts'))
})

// Task to delete target assets folder for recreation
gulp.task('clean', function () {
  return del(['public/**', '!public'])
})


