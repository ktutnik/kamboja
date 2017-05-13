import { JsonActionResult, Core } from "../../src"
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

describe("JsonActionResult", () => {
    let spy: Sinon.SinonSpy;
    let HttpResponse = new H.HttpResponse()
    let HttpRequest = new H.HttpRequest()

    beforeEach(() => {
        spy = Sinon.spy(HttpResponse, "json")
    })

    afterEach(() => {
        spy.restore();
    })

    it("Should be instanceof Core.ActionResult", () => {
        let view = new JsonActionResult({})
        Chai.expect(view instanceof Core.ActionResult).true
    })

    it("Should return json properly", () => {
        let view = new JsonActionResult({ message: "Hello" })
        view.execute(HttpRequest, HttpResponse, RouteInfo)
        let body = spy.getCall(0).args[0]
        Chai.expect(body).deep.eq({ message: "Hello" })
    })
})