const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create(),
  rename = require('gulp-rename'),
  buffer = require('vinyl-buffer'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  source = require('vinyl-source-stream'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  svgSprite = require('gulp-svg-sprites'),
  changed = require('gulp-changed'),
  babelify = require('babelify'),
  browserify = require('browserify'), uglify = require('gulp-uglify'),
  lineec = require('gulp-line-ending-corrector');

// Compile scss to css
let root = "./",
  scssSRC = root + "src/scss/**/*.scss",
  jsSRC = root + "src/js/app.js",
  jsDest = root + "dist/js/",
  cssSRC = root + "style.css",
  cssDest = root + "dist/css/";

let watchStyles = root + "src/scss/**/*.scss";

let imageSRC = root + "src/images/*.+(png|jpg|gif)",
  imageDest = root + "dist/images/";

function style() {
  return gulp.src(scssSRC)
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(lineec())
    .pipe(gulp.dest(root))
    .pipe(browserSync.stream());
}

function concatCSS() {
  return gulp.src(cssSRC)
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(lineec())
    .pipe(gulp.dest(cssDest))
}

function javascript() {
  return browserify({
    entries: [jsSRC]
  })
    .transform(babelify.configure({
      presets: ['@babel/preset-env']
    }))
    .bundle()
    .pipe(source("app"))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(lineec())
    .pipe(gulp.dest(jsDest))
}

function svgOpt() {
  return gulp.src('./src/images/*.svg')
    .pipe(svgSprite())
    .pipe(gulp.dest(imageDest));
}

function imgmin() {
  return gulp.src(imageSRC)
    .pipe(changed(imageDest))
    .pipe(imagemin())
    .pipe(gulp.dest(imageDest));
}

// Watch css, html and js files and reload browser on changes in the file
function watch() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch(watchStyles, gulp.series([style, concatCSS]));
  gulp.watch(jsSRC, javascript);
  gulp.watch(imageSRC, imgmin);
  gulp.watch('./src/images/*.svg', svgOpt);
  gulp.watch(['./*.html', jsDest + 'app.min.js', cssDest + 'style.min.css']).on('change', browserSync.reload);
}

exports.style = style;
exports.concatCSS = concatCSS;
exports.javascript = javascript;
exports.watch = watch;
exports.imgmin = imgmin;
exports.svgOpt = svgOpt;

let build = gulp.parallel(watch);
gulp.task('default', build);