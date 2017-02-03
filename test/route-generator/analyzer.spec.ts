import * as Analyzer from "../../src/route-generator/analyzer"
import * as H from "../helper"
import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as Core from "../../src/core"

describe("Analyzer", () => {
    it("Should analyze missing action parameter", () => {
        let meta = H.fromCode(`
            var MyClass = (function (_super) {
                tslib_1.__extends(MyClass, _super);
                function MyClass() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MyClass.prototype.myMethod = function () { };
                return MyClass;
            }(core_1.Controller));
            tslib_1.__decorate([
                core_1.http.get("/this/is/:not/:param"),
            ], MyClass.prototype, "myMethod", null);
            exports.MyClass = MyClass;
            `, "example-file.js")
        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.MissingActionParameters,
            type: 'Warning',
            message: "Parameters [not, param] in [/this/is/:not/:param] doesn't have associated parameters in [MyClass.myMethod example-file.js]"
        }])
    })

    it("Should analyze missing route parameter", () => {
        let meta = H.fromCode(`
            var MyClass = (function (_super) {
                tslib_1.__extends(MyClass, _super);
                function MyClass() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MyClass.prototype.myMethod = function (par1) { };
                return MyClass;
            }(core_1.Controller));
            tslib_1.__decorate([
                core_1.http.get("/this/is/route"),
            ], MyClass.prototype, "myMethod", null);
            exports.MyClass = MyClass;
            `, "example-file.js")
        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.MissingRouteParameters,
            type: 'Warning',
            message: "Parameters [par1] in [MyClass.myMethod example-file.js] doesn't have associated parameters in [/this/is/route]"
        }])
    })

    it("Should analyze unassociated route parameters", () => {
        let meta = H.fromCode(`
            var MyClass = (function (_super) {
                tslib_1.__extends(MyClass, _super);
                function MyClass() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MyClass.prototype.myMethod = function (par1, par2) { };
                return MyClass;
            }(core_1.Controller));
            tslib_1.__decorate([
                core_1.http.get("/this/is/route/:par/:par2"),
            ], MyClass.prototype, "myMethod", null);
            exports.MyClass = MyClass;
            `, "example-file.js")
        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.UnAssociatedParameters,
            type: 'Warning',
            message: "Parameters [par1] in [MyClass.myMethod example-file.js] doesn't have associated parameters in [/this/is/route/:par/:par2]"
        }])
    })


    it("Should analyze duplicate routes", () => {
        let meta = H.fromCode(`
        var MyClass = (function (_super) {
            tslib_1.__extends(MyClass, _super);
            function MyClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyClass.prototype.myMethod = function () { };
            MyClass.prototype.myOtherMethod = function () { };
            return MyClass;
        }(core_1.Controller));
        tslib_1.__decorate([
            core_1.http.get("/this/is/dupe"),
        ], MyClass.prototype, "myMethod", null);
        tslib_1.__decorate([
            core_1.http.get("/this/is/dupe"),
        ], MyClass.prototype, "myOtherMethod", null);
        exports.MyClass = MyClass;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.DuplicateRoutes,
            message: 'Duplicate route [/this/is/dupe] on: \n  [MyClass.myOtherMethod example-file.js] \n  [MyClass.myMethod example-file.js]',
            type: 'Error'
        }])
    })

    it("Should not duplicate if different http method type ", () => {
        let meta = H.fromCode(`
        var MyClass = (function (_super) {
            tslib_1.__extends(MyClass, _super);
            function MyClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyClass.prototype.myMethod = function () { };
            MyClass.prototype.myOtherMethod = function () { };
            return MyClass;
        }(core_1.Controller));
        tslib_1.__decorate([
            core_1.http.get("/this/is/dupe"),
        ], MyClass.prototype, "myMethod", null);
        tslib_1.__decorate([
            core_1.http.post("/this/is/dupe"),
        ], MyClass.prototype, "myOtherMethod", null);
        exports.MyClass = MyClass;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([])
    })

    it("Should analyze conflict decorators", () => {
        let meta = H.fromCode(`
        var MyClass = (function (_super) {
            tslib_1.__extends(MyClass, _super);
            function MyClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyClass.prototype.myMethod = function (par1, par2) { };
            return MyClass;
        }(core_1.Controller));
        tslib_1.__decorate([
            core_1.http.get("/this/is/route/:par/:par2"),
            core_1.internal(),
        ], MyClass.prototype, "myMethod", null);
        exports.MyClass = MyClass;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.ConflictDecorators,
            message: 'Method decorated with @http will not visible, because the method is decorated @internal in [MyClass.myMethod example-file.js]',
            type: 'Error'
        }])
    })

    it("Should analyze API Convention fail", () => {
        let meta = H.fromCode(`
        var MyClass = (function (_super) {
            tslib_1.__extends(MyClass, _super);
            function MyClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyClass.prototype.getByPage = function () { };
            return MyClass;
        }(core_1.ApiController));
        exports.MyClass = MyClass;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.ConventionFail,
            message: "Method name match API Convention but has lack of parameters in [MyClass.getByPage example-file.js]",
            type: 'Warning'
        }])
    })

    it("Should not use 'view', 'json', 'redirect', 'file' as action because it will override existing ", () => {
        let meta = H.fromCode(`
        var MyClass = (function (_super) {
            tslib_1.__extends(MyClass, _super);
            function MyClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyClass.prototype.view = function () { };
            MyClass.prototype.json = function () { };
            MyClass.prototype.redirect = function () { };
            MyClass.prototype.file = function () { };
            return MyClass;
        }(core_1.Controller));
        exports.MyClass = MyClass;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: 1,
            type: 'Error',
            message: '[view] must not be used as action, because it will override the Controller method, in [[MyClass.view example-file.js]]'
        },
        {
            code: 1,
            type: 'Error',
            message: '[json] must not be used as action, because it will override the Controller method, in [[MyClass.json example-file.js]]'
        },
        {
            code: 1,
            type: 'Error',
            message: '[redirect] must not be used as action, because it will override the Controller method, in [[MyClass.redirect example-file.js]]'
        },
        {
            code: 1,
            type: 'Error',
            message: '[file] must not be used as action, because it will override the Controller method, in [[MyClass.file example-file.js]]'
        }])
    })

    it("Should analyze class not inherited from ApiController or Controller", () => {
        let meta = H.fromCode(`
        var MyClass = (function () {
            function MyClass() {
            }
            MyClass.prototype.getByPage = function () { };
            return MyClass;
        }());
        exports.MyClass = MyClass;
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.ClassNotInheritedFromController,
            message: "Class not inherited from ApiController or Controller in [MyClass, example-file.js]",
            type: 'Error'
        }])
    })

    it("Should analyze non exported class", () => {
        let meta = H.fromCode(`
        var MyClass = (function (_super) {
            tslib_1.__extends(MyClass, _super);
            function MyClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyClass.prototype.getByPage = function () { };
            return MyClass;
        }(core_1.Controller));
        `, "example-file.js")

        let info = Transformer.transform(meta);
        let result = Analyzer.analyze(info);
        Chai.expect(result).deep.eq([{
            code: Core.RouteAnalysisCode.ClassNotExported,
            message: "Can not generate route because class is not exported [MyClass, example-file.js]",
            type: 'Warning'
        }])
    })
})