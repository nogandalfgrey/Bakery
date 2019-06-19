const gulp = require("gulp");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const minify = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const del = require("del");
const cssbeautify = require('gulp-cssbeautify');
const gcmq = require('gulp-group-css-media-queries');
const smartgrid = require('smart-grid');

gulp.task("style", function (done) {
    gulp.src("source/scss/style.scss")
        .pipe(plumber())
        .pipe(sass({includePaths: require('node-normalize-scss').includePaths}))
        .pipe(gcmq())
        .pipe(postcss([
            autoprefixer({
                browsers: ['> 0.1%'],
                cascade: false
            })
        ]))
        .pipe(cssbeautify())
        .pipe(gulp.dest("build/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(server.stream());
    done();
});

gulp.task("js", function (done) {
    gulp.src("source/js/*.js")
        .pipe(gulp.dest("build/js"))
        .pipe(server.stream());
    done();
});

gulp.task("serve", function () {
    server.init({
        server: "build/"
    });

    gulp.watch("source/scss/**/*.scss", gulp.series("style"));
    gulp.watch("source/*.html", gulp.series("html"));
    gulp.watch("source/js/*.js", gulp.series("js"));
    gulp.watch("smartgrid.js", gulp.series("grid", "style"));
});

gulp.task("images", function () {
    return gulp.src("source/img/**/*.{png,jpg,svg}")
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true}),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function () {
    return gulp.src("source/img/**/!(bg-)*.{png,jpg}")
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest("source/img"));
});

gulp.task("sprite", function () {
    return gulp.src("source/img/icon-*.svg")
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
    return gulp.src("source/*.html")
        .pipe(posthtml([
            include()
        ]))
        .pipe(gulp.dest("build"))
        .pipe(server.stream());
});

gulp.task("copy", function () {
    return gulp.src([
            "source/fonts/**/*.{woff,woff2}",
            "source/img/**"
        ], {
            base: "source"
        })
        .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
    return del("build");
});

gulp.task("grid", function (done) {
    delete require.cache[require.resolve('./smartgrid.js')];

    let settings = require('./smartgrid.js');
    smartgrid('./source/scss', settings);

    done();
});

gulp.task("build", gulp.series("clean",
                               "images",
                               "webp",
                               "copy",
                               "grid",
                               "style",
                               "sprite",
                               "html",
                               "js"));