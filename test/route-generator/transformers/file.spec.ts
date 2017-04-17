import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as H from "../../helper"
import { Core } from "../../../src"
import * as Util from "util"
import { DefaultPathResolver } from "../../../src/resolver"
import { FileTransformer } from "../../../src/route-generator/transformers/file"

describe("FileTransformer", () => {
    it("Should transform file properly", () => {
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
})