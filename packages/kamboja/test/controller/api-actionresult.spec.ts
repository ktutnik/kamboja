import { ApiActionResult, Core } from "../../src"
import * as H from "../helper"
import * as Sinon from "sinon"
import * as Kecubung from "kecubung"
import * as Chai from "chai"
import {HttpRequest, HttpResponse, Mock} from "kamboja-testing"


let RouteInfo: any = <Core.RouteInfo>{
    qualifiedClassName: 'SimpleController, .simple-controller.js',
    methodMetaData: <Kecubung.MethodMetaData>{
        type: 'Method',
        decorators: [],
        name: 'myMethod',
    }
}

describe("ApiActionResult", () => {
    let acceptsStub: Sinon.SinonStub
    let response = new HttpResponse()
    let request = new HttpRequest()

    beforeEach(() => {
        acceptsStub = Sinon.stub(request, "getAccepts")
    })

    afterEach(() => {
        acceptsStub.restore()
    })

    it("Should be instanceof Core.ActionResult", () => {
        let view = new ApiActionResult({})
        Chai.expect(view instanceof Core.ActionResult).true
    })

    it("Should return json properly", () => {
        let view = new ApiActionResult({ message: "Hello" })
        acceptsStub.withArgs("xml").returns(false)
        view.execute(request, response, RouteInfo)
        Chai.expect(response.type).eq("application/json")
        Chai.expect(response.body).deep.eq({ message: "Hello" })
    })

    it("Should return xml properly", () => {
        let view = new ApiActionResult({ message: "Hello" })
        acceptsStub.withArgs("xml").returns("xml")
        view.execute(request, response, RouteInfo)
        Chai.expect(response.type).eq("text/xml")
        Chai.expect(response.body).deep.eq("<message>Hello</message>")
    })

    it("Should able to return empty response", () => {
        let view = new ApiActionResult(undefined)
        view.execute(request, response, RouteInfo)
        Chai.expect(response.body).undefined
    })

})