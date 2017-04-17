import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as H from "../../helper"
import { Core } from "../../../src"
import * as Util from "util"
import { DefaultPathResolver } from "../../../src/resolver"
import { ControllerTransformer } from "../../../src/route-generator/transformers/controller"

describe("ControllerTransformer", () => {
    it("Should be exit on non exported controller", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.Controller));
        `, "controller/user-controller.js")
        let test = new ControllerTransformer()
        let result = test.transform(<Kecubung.ClassMetaData>meta.children[0], undefined, undefined)
        Chai.expect(result.status).eq("ExitWithResult")
    })

    it("Should be able to transform name properly", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.Controller));
            exports.AbsoluteRootController = AbsoluteRootController;
        `, "controller/user-controller.js")
        let test = new ControllerTransformer()
        let result = test.transform(<Kecubung.ClassMetaData>meta.children[0], undefined, undefined)
        Chai.expect(result.info[0].route).eq("/absoluteroot/index")
    })


})