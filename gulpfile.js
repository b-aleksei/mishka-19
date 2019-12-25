"use strict";

const gulp = require("gulp"),
plumber = require("gulp-plumber"),
uglify = require("gulp-uglify"),
htmlmin = require("gulp-htmlmin"),
sourcemap = require("gulp-sourcemaps"),
sass = require("gulp-sass"),
postcss = require("gulp-postcss"),
csso = require("gulp-csso"),
rename = require("gulp-rename"),
svgstore = require("gulp-svgstore"),
posthtml = require("gulp-posthtml"),
include = require("posthtml-include"),
del = require("del"),
autoprefixer = require("autoprefixer"),
server = require("browser-sync").create(),
webp = require("gulp-webp"),
imagemin = require("gulp-imagemin"),
imageminJpegRecompress = require('imagemin-jpeg-recompress'),
pngquant = require('imagemin-pngquant'),
cache = require('gulp-cache');

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
});

gulp.task("js", function () {
  return gulp.src("source/js/script.js")
    .pipe(uglify())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js/"));
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
    .pipe(gulp.dest("source/img/img-compress"))
});

gulp.task('clear', () =>
  cache.clearAll()
);

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img/webp"))
});

gulp.task("sprite", function () {
  return gulp.src("source/111/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/img"))
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
  .pipe(gulp.dest("build"))
});

gulp.task("minhtml", () => {
  return gulp.src("build/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
});

gulp.task("copySprite", function () {
  return gulp.src("source/img/sprite.svg")
    .pipe(gulp.dest("build/img"))
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("watch", function () {
gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
gulp.watch("source/*.html", gulp.series("html")).on("change", server.reload);
gulp.watch("source/js/*.js", gulp.series("js")).on("change", server.reload);
gulp.watch("source/img/sprite.svg", gulp.series("copySprite", "html")).on("change", server.reload);
});

gulp.task("build", gulp.series("clean", "copy", "css", "html", "minhtml", "js"));
gulp.task("start", gulp.parallel("server", "watch"));
