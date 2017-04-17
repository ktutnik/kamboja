import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as H from "../../helper"
import { Core } from "../../../src"
import * as Util from "util"
import { DefaultPathResolver } from "../../../src/resolver"
import { InternalDecoratorTransformer } from "../../../src/route-generator/transformers/internal-decorator"

describe("InternalDecoratorTransformer", () => {
    /*it("Should pass to next transformer if provide @http.get()", () => {
        let meta = H.fromCode(`
        var MyController = (function (_super) {
            tslib_1.__extends(MyController, _super);
            function MyController() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyController.prototype.index = function (model) { };
            return MyController;
        }(controller_1.Controller));
        tslib_1.__decorate([
            src_1.http.get(),
        ], MyController.prototype, "index", null);
        exports.MyController = MyController;
        `, "controller/user-controller.js")
        let test = new InternalDecoratorTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.status).eq("Next")
        Chai.expect(result.info[0].httpMethod).eq("GET")
    })*/
})