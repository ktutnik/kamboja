import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as H from "../../helper"
import { Core } from "../../../src"
import * as Util from "util"
import { DefaultPathResolver } from "../../../src/resolver"
import { ModuleTransformer } from "../../../src/route-generator/transformers/module"

describe("ModuleTransformer", () => {
    it("Should transform module properly", () => {
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
        let test = new ModuleTransformer()
        let result = test.transform(<Kecubung.ParentMetaData>meta.children[0], "", undefined)
        Chai.expect(result.info[0].route).eq("/namespace/relative/index")
    })
})