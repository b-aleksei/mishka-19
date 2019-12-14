"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var webp = require("gulp-webp");
var imagemin = require("gulp-imagemin");
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    // .pipe(csso())
    // .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    // .pipe(gulp.dest("build/css"))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    // server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imageminJpegRecompress(),
      imagemin.svgo(),
      imagemin.optipng({optimizationLevel: 3}),
      pngquant({quality: '65-70', speed: 5})
    ],{
      verbose: true
    })))
    .pipe(gulp.dest("source/xxx"))
});

gulp.task('clear', () =>
  cache.clearAll()
);

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/www"))
});

gulp.task("sprite", function () {
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/img"))
  // .pipe(gulp.dest("build/img"))
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("source"))
  // .pipe(gulp.dest("build"))
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
});

gulp.task("clean", function () {
  return del("build");
});

gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
// gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
gulp.watch("source/*.html").on("change", server.reload);

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

/*gulp.task("build", gulp.series("clean", "copy", "css", "sprite", "html"));
gulp.task("start2", gulp.series("build", "server"));*/
gulp.task("start", gulp.series("css", "server"));
