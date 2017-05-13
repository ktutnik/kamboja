import { ApiActionResult, Core } from "../../src"
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

describe("ApiActionResult", () => {
    let jsonSpy: Sinon.SinonSpy;
    let sendSpy: Sinon.SinonSpy;
    let endSpy: Sinon.SinonSpy;
    let isAcceptStub: Sinon.SinonStub
    let HttpResponse = new H.HttpResponse()
    let HttpRequest = new H.HttpRequest()

    beforeEach(() => {
        jsonSpy = Sinon.spy(HttpResponse, "json")
        endSpy = Sinon.spy(HttpResponse, "end")
        sendSpy = Sinon.spy(HttpResponse, "send")
        isAcceptStub = Sinon.stub(HttpRequest, "isAccept")
    })

    afterEach(() => {
        jsonSpy.restore();
        endSpy.restore();
        sendSpy.restore();
        isAcceptStub.restore()
    })

    it("Should be instanceof Core.ActionResult", () => {
        let view = new ApiActionResult({})
        Chai.expect(view instanceof Core.ActionResult).true
    })

    it("Should return json properly", () => {
        let view = new ApiActionResult({ message: "Hello" })
        view.execute(HttpRequest, HttpResponse, RouteInfo)
        let body = jsonSpy.getCall(0).args[0]
        Chai.expect(body).deep.eq({ message: "Hello" })
    })

    it("Should able to return empty response", () => {
        let view = new ApiActionResult(undefined)
        view.execute(HttpRequest, HttpResponse, RouteInfo)
        Chai.expect(endSpy.called).true
    })

})