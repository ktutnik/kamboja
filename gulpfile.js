"use strict";


var gulp = require("gulp"),
    tsc = require("gulp-typescript"),
    del = require("del"),
    runSequence = require("run-sequence"),
    mocha = require("gulp-mocha"),
    fs = require("fs"),
    path = require("path"),
    istanbul = require("gulp-istanbul");

var PACKAGES = [
    "packages/kecubung",
    "packages/kamboja-core",
    "packages/kamboja-testing",
    "packages/kamboja",
    "packages/kamboja-express",
    "packages/kamboja-mongoose"
]

//********CLEAN ************
gulp.task("clean-source", function (cb) {
    return del([
        "./packages/*/src/**/*.js",
        "./packages/*/src/**/*.d.ts",
        "./packages/*/src/**/*.js.map"
    ], cb)
})

gulp.task("clean-test", function (cb) {
    return del([
        "./packages/*/test/**/*.js",
        "./packages/*/test/**/*.d.ts",
        "./packages/*/test/**/*.js.map"
    ], cb)
})

gulp.task("clean-lib", function (cb) {
    return del([
        "./coverage",
        /* 
            reflect-metadata need to removed in packages children
            due to issue with global value which referencing different
            reflect-metadata library
        */
        "./packages/*/node_modules/reflect-metadata",
        /*
            @types/chai need to removed due to typescript issue
            reporting duplicate operator error 
        */
        "./packages/*/node_modules/@types/chai"], 
        cb)
})


gulp.task("clean", function (cb) {
    runSequence("clean-source", "clean-test", "clean-lib", cb);
});

//******** BUILD *************

function buildTypeScript(name, root, path, target, declaration) {
    if (!declaration) declaration = false
    var tsProject = tsc.createProject("tsconfig.json", {
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


var buildSequence = []
for (var i = 0; i < PACKAGES.length; i++) {
    var pack = PACKAGES[i];
    var lean = pack.replace("packages/", "")
    buildSequence.push(buildTypeScript("build-source-" + lean, pack, "/src", "/src"))
    buildSequence.push(buildTypeScript("build-test-" + lean, pack, "/test", "/test"))
}

gulp.task("build", function (cb) {
    buildSequence.push(cb)
    runSequence.apply(null, buildSequence)
});

//******** TEST *************

gulp.task("test-debug", function () {
    return gulp.src(PACKAGES.map(function (x) { return x + "/test/**/*.js" }))
        .pipe(mocha());
});

gulp.task("pre-test", function () {
    return gulp.src(PACKAGES.map(function (x) { return x + "/src/**/*.js" }))
        .pipe(istanbul({ includeUntested: false }))
        .pipe(istanbul.hookRequire());
});

gulp.task("test", ["pre-test"], function () {
    return gulp.src(PACKAGES.map(function (x) { return x + "/test/**/*.js" }))
        .pipe(mocha())
        .pipe(istanbul.writeReports());
});

/** DEFAULT */
gulp.task("default", function (cb) {
    runSequence(
        "clean",
        "build",
        "test",
        cb);
}); 