"use strict";


var gulp = require("gulp"),
    tsc = require("gulp-typescript"),
    del = require("del"),
    runSequence = require("run-sequence"),
    mocha = require("gulp-mocha"),
    fs = require("fs"),
    path = require("path"),
    istanbul = require("gulp-istanbul");
//********CLEAN ************

var PACKAGES = [
    "packages/kamboja", 
    "packages/kamboja-express"
    //"packages/kamboja-mongoose"
    ]


gulp.task("clean-source", function (cb) {
    return del([
        "./packages/*/src/**/*.js",
        "./packages/*/src/**/*.d.ts",
        "./packages/*/src/**/*.js.map"], cb)
})

gulp.task("clean-test", function (cb) {
    return del([
        "./packages/*/test/**/*.js",
        "./packages/*/test/**/*.d.ts",
        "./packages/*/test/**/*.js.map"], cb)
})

gulp.task("clean-lib", function (cb) {
    return del(["./coverage", "./packages/*/lib", "./packages/*/coverage"], cb)
})


gulp.task("clean", function (cb) {
    runSequence("clean-source", "clean-test", "clean-lib", cb);
});

//******** BUILD *************

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


var buildSequence = []
for(var i = 0; i < PACKAGES.length; i++){
    var pack = PACKAGES[i];
    var lean = pack.replace("/", "-")
    buildSequence.push(buildTypeScript("build-source-" + lean, pack, "/src", "/src"))
    buildSequence.push(buildTypeScript("build-test-" + lean, pack, "/test", "/test"))
    buildSequence.push(buildTypeScript("build-dist-" + lean, pack, "/src", "/lib", true))
}

gulp.task("build", function (cb) {
    buildSequence.push(cb)
    runSequence.apply(null, buildSequence)
});

//******** TEST *************
gulp.task('pre-test', function () {
    return gulp.src(PACKAGES.map(function(x){ return x + "/src/**/*.js" }))
        .pipe(istanbul({ includeUntested: false }))
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
    return gulp.src(PACKAGES.map(function(x){ return x + "/test/**/*.js" }))
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