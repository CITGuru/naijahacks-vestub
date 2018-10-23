'use strtict'
const gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  concat = require('gulp-concat'),
  minify = require('gulp-minify'),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  htmlmin = require('gulp-htmlmin'),
  del = require('del'),
  //  uncss = require('gulp-uncss')
  uglify = require('gulp-uglify'),
  pump = require('pump'),
  sass = require('gulp-sass')



gulp.task('sass', () => {
  return gulp.src([
    './src/scss/*.scss', 
    'node_modules/bootstrap/scss/bootstrap.scss', 
    'node_modules/mdbootstrap/scss/mdb.scss',
    'node_modules/font-awesome/scss/font-awesome.scss'
    ])
    .pipe(sass({
      errLogToConsole: true,
      sourceComments: true,
      includePaths: ['node_modules/bootstrap/scss', 'node_modules/mdbootstrap/scss', 'node_modules/font-awesome/scss']
    }).on('error', sass.logError))
    .pipe(gulp.dest('./src/css'))
    .pipe(browserSync.stream());
});


gulp.task('fonts', () => {
  return gulp.src(['node_modules/font-awesome/fonts/fontawesome-webfont.*'])
    .pipe(gulp.dest('src/fonts/'))
    .pipe(browserSync.stream());

});

gulp.task('font', () => {
  return gulp.src(['node_modules/mdbootstrap/font/roboto/*'])
    .pipe(gulp.dest('src/font/roboto'))
    .pipe(browserSync.stream());

});

gulp.task('js', () => {
  return gulp.src([
    'node_modules/bootstrap/dist/js/bootstrap.min.js', 
    'node_modules/jquery/dist/jquery.min.js', 
    'node_modules/tether/dist/js/tether.min.js',
    'node_modules/mdbootstrap/js/mdb.min.js',
    'node_modules/mdbootstrap/js/popper.min.js'
  ])
    .pipe(gulp.dest("./src/js"))
    .pipe(browserSync.stream());

});

// Default Gulp task to run including all necessary dependencies
gulp.task('default', ['browser-sync'], () => {
  gulp.watch(['src/**/*.html', 'src/js/*.js',
    'src/css/*.css'
  ], ['watch'])
  gulp.watch(['public/**/*.html', 'public/js/*.js',
    'public/css/*.css'
  ], reload)
})


gulp.task('watch', ['pack-minify-js', 'pack-minify-css','copy-img', 'copy-css', 'copy-js',])

gulp.task('browser-sync', () => {
  browserSync.init({
    server: './views'
  })
})

// Build task to initiate minify tasks for CSS and JS
gulp.task('build', [
   'pack-minify-js', 'pack-minify-css', 'copy-img', 'copy-css', 'copy-js', 'copy-fonts','copy-font', 'js', 'sass', 'fonts', 'font'
])

gulp.task('setup', ['build']);

// Task to uglify JS
gulp.task('pack-minify-js', (cb) => {
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
gulp.task('pack-minify-css', () => {
  return gulp.src(['src/css/*.css', '!src/css/*.min.css'])
    .pipe(concat('main.css'))
    .pipe(cleanCss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('public/css'))
})

// // Task to copy assets
gulp.task('copy-img', () => {
  return gulp.src(['src/assets/img/*', 'src/assets/img/**/*'])
    .pipe(gulp.dest('public/img'))
})

gulp.task('copy-css', () => {
  return gulp.src('src/css/*.css')
    .pipe(gulp.dest('public/css'))
})

gulp.task('copy-js', () => {
  return gulp.src('src/js/*.js')
    .pipe(gulp.dest('public/js'))
})

gulp.task('copy-fonts', () => {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('public/fonts'))
})

gulp.task('copy-font', () => {
  return gulp.src('src/font/roboto/*')
    .pipe(gulp.dest('public/font/roboto'))
})

// Task to delete target assets folder for recreation
gulp.task('clean', () => {
  return del(['public/**', '!public'])
})