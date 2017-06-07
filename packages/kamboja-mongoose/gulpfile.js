"use strict";

var gulp = require("gulp"),
    tsc = require("gulp-typescript"),
    del = require("del"),
    runSequence = require("run-sequence"),
    mocha = require("gulp-mocha"),
    istanbul = require("gulp-istanbul");

function buildTypeScript(name, root, path, target, declaration){
    if(!declaration) declaration = false
    var tsProject = tsc.createProject(root + "/tsconfig.json", {
        declaration: declaration,
        noResolve: false,
        typescript: require("typescript")
    });

    gulp.task(name, function () {
        return gulp.src([root + path + "/**/*.ts"])
            .pipe(tsProject())
            .on("error", function (err) {
                process.exit(1);
            })
            .pipe(gulp.dest(root + target));
    });
    return name;
}


//********CLEAN ************

gulp.task("clean-source", function (cb) {
    return del([
        "./src/**/*.js",
        "./src/**/*.d.ts",
        "./src/**/*.js.map"], cb)
})

gulp.task("clean-test", function (cb) {
    return del([
        "./test/**/*.js",
        "./test/**/*.d.ts",
        "./test/**/*.js.map"], cb)
})

gulp.task("clean-lib", function (cb) {
    return del(["./lib"], cb)
})

gulp.task("clean", function (cb) {
    runSequence("clean-source", "clean-test", "clean-lib", cb);
});

//******** BUILD *************
buildTypeScript("build-source", ".", "/src", "/src")
buildTypeScript("build-test", ".", "/test", "/test")
buildTypeScript("build-dist", ".", "/src", "/lib", true)

gulp.task("build", function (cb) {
    runSequence("build-source", "build-test", "build-dist", cb);
});


//******** TEST *************
gulp.task('pre-test', function () {
    return gulp.src(['src/**/*.js'])
        .pipe(istanbul({ includeUntested: false }))
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
    return gulp.src(['test/**/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});

/** DEFAULT */
gulp.task("default", function (cb) {
    runSequence(
        "clean",
        "build",
        "test",
        cb);
}); 