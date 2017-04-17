import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as H from "../../helper"
import { Core } from "../../../src"
import * as Util from "util"
import { DefaultPathResolver } from "../../../src/resolver"
import { InternalDecoratorTransformer } from "../../../src/route-generator/transformers/internal-decorator"

describe("InternalDecoratorTransformer", () => {
    it("Should exit if contains @internal", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.privateMethod = function () { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.internal(),
        ], MyController.prototype, "privateMethod", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new InternalDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.status).eq("Exit")
    })

    it("Should pass to next transformer if doesn't contains @internal", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.privateMethod = function () { };
            return MyController;
        }(controller_1.Controller));
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new InternalDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.status).eq("Next")
    })

    it("Should analyze DecoratorConflict if combine with @http.get()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.privateMethod = function () { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.internal(),
            src_1.http.get()            
        ], MyController.prototype, "privateMethod", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new InternalDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].analysis).deep.eq([Core.RouteAnalysisCode.ConflictDecorators])
    })

    it("Should analyze DecoratorConflict if combine with @http.post()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.privateMethod = function () { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.internal(),
            src_1.http.post()            
        ], MyController.prototype, "privateMethod", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new InternalDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].analysis).deep.eq([Core.RouteAnalysisCode.ConflictDecorators])
    })

    it("Should analyze DecoratorConflict if combine with @http.put()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.privateMethod = function () { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.internal(),
            src_1.http.put()            
        ], MyController.prototype, "privateMethod", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new InternalDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].analysis).deep.eq([Core.RouteAnalysisCode.ConflictDecorators])
    })

    it("Should analyze DecoratorConflict if combine with @http.patch()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.privateMethod = function () { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.internal(),
            src_1.http.patch()            
        ], MyController.prototype, "privateMethod", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new InternalDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].analysis).deep.eq([Core.RouteAnalysisCode.ConflictDecorators])
    })

    it("Should analyze DecoratorConflict if combine with @http.delete()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.privateMethod = function () { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.internal(),
            src_1.http.delete()            
        ], MyController.prototype, "privateMethod", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new InternalDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].analysis).deep.eq([Core.RouteAnalysisCode.ConflictDecorators])
    })

})