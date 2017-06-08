import * as Chai from "chai"
import * as Kecubung from "kecubung"
import * as H from "../../helper"
import { Core } from "../../../src"
import * as Util from "util"
import { DefaultPathResolver } from "../../../src/resolver"
import { DefaultActionTransformer } from "../../../src/route-generator/transformers/default-action"

describe("DefaultActionTransformer", () => {
    it("Should be exit on non exported controller", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.Controller));
        `, "controller/user-controller.js")
        let test = new DefaultActionTransformer()
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", undefined)
        Chai.expect(result.info[0].route).eq("/user/index")
    })

    it("Should add route and collaborator if requested from previous transformer", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.Controller));
        `, "controller/user-controller.js")
        let test = new DefaultActionTransformer()
        let prevResult = [<Core.RouteInfo>{
            initiator: 'DefaultAction',
            overrideRequest: Core.OverrideRequest.Route,
            httpMethod: 'GET',
            methodMetaData:{  },
            methodPath: '/index'
        }]
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", prevResult)
        Chai.expect(result.info[0].route).eq("/user/index")
        Chai.expect(result.info[0].collaborator.some(x => x == "DefaultAction")).true
        
    })

    it("Should not add route if not requested from previous transformer", () => {
        let meta = H.fromCode(`
            var AbsoluteRootController = (function (_super) {
                function AbsoluteRootController() {
                }
                AbsoluteRootController.prototype.index = function (par1, par2) { };
                return AbsoluteRootController;
            }(controller_1.Controller));
        `, "controller/user-controller.js")
        let test = new DefaultActionTransformer()
        let prevResult = [<Core.RouteInfo>{
            initiator: 'DefaultAction',
            //overrideRequest: Core.OverrideRequest.Route,
            httpMethod: 'GET',
            methodMetaData:{  },
            methodPath: '/index'
        }]
        let result = test.transform((<Kecubung.ClassMetaData>meta.children[0]).methods[0], "/user", prevResult)
        Chai.expect(result.info[0].route).undefined
        Chai.expect(result.info[0].collaborator.some(x => x == "DefaultAction")).true
        
    })
})