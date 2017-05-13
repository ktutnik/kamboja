import { RedirectActionResult, Core } from "../../src"
import * as H from "../helper"
import * as Sinon from "sinon"
import * as Kecubung from "kecubung"
import * as Chai from "chai"

let RouteInfo: any = <Core.RouteInfo>{
    qualifiedClassName: 'SimpleController, .simple-controller.js',
    methodMetaData: <Kecubung.MethodMetaData>{
        type: 'Method',
        decorators: [],
        name: 'myMethod',
    }
}

describe("RedirectActionResult", () => {
    

    it("Should be instanceof Core.ActionResult", () => {
        let view = new RedirectActionResult(undefined)
        Chai.expect(view instanceof Core.ActionResult).true
    })

})