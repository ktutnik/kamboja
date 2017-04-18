import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as H from "../../helper"
import { Core } from "../../../src"
import * as Util from "util"
import { DefaultPathResolver } from "../../../src/resolver"
import { FileTransformer } from "../../../src/route-generator/transformers/file"

describe("FileTransformer", () => {
    it("Should transform controller properly", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.Controller));
            exports.AbsoluteRootController = AbsoluteRootController;
        `, "controller/user-controller.js")
        let test = new FileTransformer()
        let result = test.transform(meta, undefined, undefined)
        Chai.expect(result.info[0].route).eq("/absoluteroot/index")
    })

    it("Should transform controller with namespace properly", () => {
        let meta = H.fromCode(`
            var Namespace;
            (function (Namespace) {
                var AbsoluteRootController = (function (_super) {
                    function AbsoluteRootController() {
                    }
                    AbsoluteRootController.prototype.index = function (par1, par2) { };
                    return AbsoluteRootController;
                }(controller_1.Controller));
                Namespace.AbsoluteRootController = AbsoluteRootController;
            })(Namespace = exports.Namespace || (exports.Namespace = {}));
        `, "controller/user-controller.js")
        let test = new FileTransformer()
        let result = test.transform(meta, "", undefined)
        Chai.expect(result.info[0].route).eq("/namespace/absoluteroot/index")
    })

    it("Should transform controller with @http.root() properly", () => {
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
        let test = new FileTransformer()
        let result = test.transform(meta, undefined, undefined)
        Chai.expect(result.info[0].route).eq("/absolute/index")
    })

    it("Should transform controller with @http.root() with namespace properly", () => {
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
        let test = new FileTransformer()
        let result = test.transform(meta, "", undefined)
        Chai.expect(result.info[0].route).eq("/namespace/relative/index")
    })
})