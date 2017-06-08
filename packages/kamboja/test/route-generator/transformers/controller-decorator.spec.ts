import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as H from "../../helper"
import { Core } from "../../../src"
import * as Util from "util"
import { DefaultPathResolver } from "../../../src/resolver"
import { ControllerWithDecorator } from "../../../src/route-generator/transformers/controller-decorator"

describe("ControllerWithDecorator", () => {
    it("Should be exit on non exported controller", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.Controller));
            AbsoluteRootController = tslib_1.__decorate([
                src_1.http.root("/absolute")
            ], AbsoluteRootController);
        `, "controller/user-controller.js")
        let test = new ControllerWithDecorator()
        let result = test.transform(<Kecubung.ClassMetaData>meta.children[0], undefined, undefined)
        Chai.expect(result.status).eq("ExitWithResult")
    })

    it("Should return next on controller without @http.root() decorator", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.Controller));
            AbsoluteRootController = tslib_1.__decorate([
                src_1.http.notroot("/absolute")
            ], AbsoluteRootController);
            exports.AbsoluteRootController = AbsoluteRootController;
        `, "controller/user-controller.js")
        let test = new ControllerWithDecorator()
        let result = test.transform(<Kecubung.ClassMetaData>meta.children[0], undefined, undefined)
        Chai.expect(result.status).eq("Next")
    })

    it("Should be able to change controller name with decorator", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.Controller));
            AbsoluteRootController = tslib_1.__decorate([
                src_1.http.root("/absolute")
            ], AbsoluteRootController);
            exports.AbsoluteRootController = AbsoluteRootController;
        `, "controller/user-controller.js")
        let test = new ControllerWithDecorator()
        let result = test.transform(<Kecubung.ClassMetaData>meta.children[0], undefined, undefined)
        Chai.expect(result.info[0].route).eq("/absolute/index")
    })

    it("Should be able to change api controller name with decorator", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.ApiController));
            AbsoluteRootController = tslib_1.__decorate([
                src_1.http.root("/absolute")
            ], AbsoluteRootController);
            exports.AbsoluteRootController = AbsoluteRootController;
        `, "controller/user-controller.js")
        let test = new ControllerWithDecorator()
        let result = test.transform(<Kecubung.ClassMetaData>meta.children[0], undefined, undefined)
        Chai.expect(result.info[0].route).eq("/absolute/index")
    })

    it("Should analyze issue if @http.root() decorator used twice", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.ApiController));
            AbsoluteRootController = tslib_1.__decorate([
                src_1.http.root("/absolute"),
                src_1.http.root("/absolute")
            ], AbsoluteRootController);
            exports.AbsoluteRootController = AbsoluteRootController;
        `, "controller/user-controller.js")
        let test = new ControllerWithDecorator()
        let result = test.transform(<Kecubung.ClassMetaData>meta.children[0], undefined, undefined)
        Chai.expect(result.info[0].analysis).deep.eq([Core.RouteAnalysisCode.DuplicateRoutes])
    })

    it("Should add parent name when using relative path", () => {
        let meta = H.fromCode(`
            var Namespace;
            (function (Namespace) {
                var AbsoluteRootController = (function (_super) {
                    function AbsoluteRootController() {
                    }
                    AbsoluteRootController.prototype.index = function (par1, par2) { };
                    return AbsoluteRootController;
                }(controller_1.ApiController));
                AbsoluteRootController = tslib_1.__decorate([
                    src_1.http.root("relative")
                ], AbsoluteRootController);
                Namespace.AbsoluteRootController = AbsoluteRootController;
            })(Namespace = exports.Namespace || (exports.Namespace = {}));
        `, "controller/user-controller.js")
        let test = new ControllerWithDecorator()
        let nameSpace = <Kecubung.ParentMetaData>meta.children[0]
        let result = test.transform(<Kecubung.ClassMetaData>nameSpace.children[0], "/namespace", undefined)
        Chai.expect(result.info[0].route).eq("/namespace/relative/index")
    })

    it("Should close relative path if no parent provided", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.ApiController));
            AbsoluteRootController = tslib_1.__decorate([
                src_1.http.root("relative")
            ], AbsoluteRootController);
            exports.AbsoluteRootController = AbsoluteRootController;
        `, "controller/user-controller.js")
        let test = new ControllerWithDecorator()
        let result = test.transform(<Kecubung.ClassMetaData>meta.children[0], undefined, undefined)
        Chai.expect(result.info[0].route).eq("/relative/index")
    })

    it("Should allow parameters inside url", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.ApiController));
            AbsoluteRootController = tslib_1.__decorate([
                src_1.http.root("relative/:par1/:par2/other")
            ], AbsoluteRootController);
            exports.AbsoluteRootController = AbsoluteRootController;
        `, "controller/user-controller.js")
        let test = new ControllerWithDecorator()
        let result = test.transform(<Kecubung.ClassMetaData>meta.children[0], undefined, undefined)
        Chai.expect(result.info[0].route)
            .eq("/relative/:par1/:par2/other/index")
        Chai.expect(result.info[0].analysis).undefined
    })

    it("Should analyze if provided url parameter doesn't have associated action parameter", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.ApiController));
            AbsoluteRootController = tslib_1.__decorate([
                src_1.http.root("relative/:missing/other")
            ], AbsoluteRootController);
            exports.AbsoluteRootController = AbsoluteRootController;
        `, "controller/user-controller.js")
        let test = new ControllerWithDecorator()
        let result = test.transform(<Kecubung.ClassMetaData>meta.children[0], undefined, undefined)
        Chai.expect(result.info[0].analysis)
            .deep.eq([Core.RouteAnalysisCode.UnAssociatedParameters])
    })

    it("Should not duplicate analysis if inside method decorator has unassociated analysis", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.ApiController));
            AbsoluteRootController = tslib_1.__decorate([
                src_1.http.root("relative/:missing/other")
            ], AbsoluteRootController);
            tslib_1.__decorate([
                src_1.http.get("/other/:none"),
            ], AbsoluteRootController.prototype, "index", null);
            exports.AbsoluteRootController = AbsoluteRootController;
        `, "controller/user-controller.js")
        let test = new ControllerWithDecorator()
        let result = test.transform(<Kecubung.ClassMetaData>meta.children[0], undefined, undefined)
        Chai.expect(result.info[0].analysis)
            .deep.eq([Core.RouteAnalysisCode.UnAssociatedParameters])
    })

    it("Should automatically add 'required' validator on the parameter", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.ApiController));
            AbsoluteRootController = tslib_1.__decorate([
                src_1.http.root("relative/:par2/other")
            ], AbsoluteRootController);
            exports.AbsoluteRootController = AbsoluteRootController;
        `, "controller/user-controller.js")
        let test = new ControllerWithDecorator()
        let result = test.transform(<Kecubung.ClassMetaData>meta.children[0], undefined, undefined)
        Chai.expect(result.info[0].methodMetaData.parameters[1].decorators[0].name)
            .eq("required")
    })

})