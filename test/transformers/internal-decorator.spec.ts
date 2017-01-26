import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as Core from "../../src/core"
import * as H from "../helper"
import { InternalDecoratorTransformer } from "../../src/transformers/internal-decorator"

describe("InternalDecoratorTransformer", () => {
    it("Should return route info properly", () => {
        let dummy = new InternalDecoratorTransformer();
        let info = H.transform(`
            var MyController = (function (_super) {
                function MyController() {
                }
                MyController.prototype.internalMethod = function (par1) { };
                return MyController;
            }(core_1.Controller));
            tslib_1.__decorate([
                core_1.internal(),
            ], MyController.prototype, "internalMethod", null);
            exports.MyController = MyController;
        `)
        let method = (<Kecubung.ClassMetaData>info.children[0]).methods[0]
        let result = dummy.transform(method, "/myclass", undefined)
        Chai.expect(result.info).undefined
    })

    it.only("Should return with analysis when added with httpmethod", () => {
        let dummy = new InternalDecoratorTransformer();
        let info = H.transform(`
            var MyController = (function (_super) {
                function MyController() {
                }
                MyController.prototype.internalMethod = function (par1) { };
                return MyController;
            }(core_1.Controller));
            tslib_1.__decorate([
                core_1.internal(), //<----------------- internal
                core_1.http.get(), //<----------------- GET
            ], MyController.prototype, "internalMethod", null);
            exports.MyController = MyController;
        `)
        let method = (<Kecubung.ClassMetaData>info.children[0]).methods[0]
        let result = dummy.transform(method, "/myclass", undefined)
        Chai.expect(result.info).deep.eq([
            <Core.RouteInfo>{
                analysis: [Core.RouteAnalysisCode.ConflictDecorators],
                methodName: "internalMethod",
                parameters: [
                    "par1"
                ],
                httpMethod: "GET",
                generatingMethod: "HttpMethodDecorator"
            }
        ]
        )
    })

})