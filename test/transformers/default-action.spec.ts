import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as Core from "../../src/core"
import * as H from "../helper"
import {DefaultActionTransformer} from "../../src/transformers/default-action"

describe("DefaultActionTransformer", () => {
    it("Should return route info properly", () => {
        let dummy = new DefaultActionTransformer();
        let info = H.transform(`
            var MyController = (function (_super) {
                function MyController() {
                }
                MyController.prototype.myMethod = function (par1) { };
                return MyController;
            }(core_1.Controller));
            exports.MyController = MyController;
        `)
        let method = (<Kecubung.ClassMetaData>info.children[0]).methods[0]
        let result = dummy.transform(method, "/myclass", undefined)
        Chai.expect(result.info).deep.eq([
            <Core.RouteInfo>{
                generatingMethod: "Default",
                methodName: "myMethod",
                parameters: ["par1"],
                httpMethod: "GET",
                route: "/myclass/mymethod/:par1"
            }
        ])
    })

    it("Should fill default route if previous result provided", () => {
        let dummy = new DefaultActionTransformer();
        let info = H.transform(`
            var MyController = (function (_super) {
                function MyController() {
                }
                MyController.prototype.myMethod = function (par1) { };
                return MyController;
            }(core_1.Controller));
            exports.MyController = MyController;
        `)
        let method = (<Kecubung.ClassMetaData>info.children[0]).methods[0]
        let previousResult = [
            <Core.RouteInfo>{
                generatingMethod: "HttpMethodDecorator",
                methodName: "myMethod",
                parameters: ["par1"],
                httpMethod: "POST",
            }
        ]
        let result = dummy.transform(method, "/myclass", previousResult)
        Chai.expect(result.info).deep.eq([
            <Core.RouteInfo>{
                generatingMethod: "Default",
                methodName: "myMethod",
                parameters: ["par1"],
                httpMethod: "POST",
                route: "/myclass/mymethod/:par1"
            }
        ])
    })
})