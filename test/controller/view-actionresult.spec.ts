import { ViewActionResult, Core } from "../../src"
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

describe("ViewActionResult", () => {
    let spy: Sinon.SinonSpy;
    let HttpResponse = new H.HttpResponse()
    let HttpRequest = new H.HttpRequest()

    beforeEach(() => {
        spy = Sinon.spy(HttpResponse, "view")
    })

    afterEach(() => {
        spy.restore();
    })

    it("Should be instanceof Core.ActionResult", () => {
        let view = new ViewActionResult({}, undefined, undefined)
        Chai.expect(view instanceof Core.ActionResult).true
    })

    it("Should able to called without view name", () => {
        let view = new ViewActionResult({}, undefined, undefined)
        view.execute(HttpRequest, HttpResponse, RouteInfo)
        let viewName = spy.getCall(0).args[0]
        Chai.expect(viewName).eq("simple/mymethod")
    })

    it("Should able to called with view name on controller scope", () => {
        let view = new ViewActionResult({}, "index", undefined)
        view.execute(HttpRequest, HttpResponse, RouteInfo)
        let viewName = spy.getCall(0).args[0]
        Chai.expect(viewName).eq("simple/index")
    })

    it("Should able to called with view name outside controller", () => {
        let view = new ViewActionResult({}, "other/index", undefined)
        view.execute(HttpRequest, HttpResponse, RouteInfo)
        let viewName = spy.getCall(0).args[0]
        Chai.expect(viewName).eq("other/index")
    })

    it("Should provide correct view name when controller name not end with 'controller'", () => {
        //called without view name
        let view = new ViewActionResult({}, undefined, undefined)
        view.execute(HttpRequest, HttpResponse, <Core.RouteInfo>{
            qualifiedClassName: 'Proud, .simple-controller.js',
            methodMetaData: <Kecubung.MethodMetaData>{
                name: 'myMethod',
            }
        })
        let viewName = spy.getCall(0).args[0]
        Chai.expect(viewName).eq("proud/mymethod")
    })

    it("Should throw if used outside Controller but use relative view path", async () => {
        try {
            let view = new ViewActionResult({}, "index", undefined)
            await view.execute(HttpRequest, HttpResponse, undefined)
        } catch (e) {
            Chai.expect(e.message).eq("Relative view path can not be use inside middlewares")
        }
    })

    it("Should throw if used outside Controller but not provided view name", async () => {
        try {
            let view = new ViewActionResult({}, undefined, undefined)
            await view.execute(HttpRequest, HttpResponse, undefined)
        } catch (e) {
            Chai.expect(e.message).eq("Relative view path can not be use inside middlewares")
        }
    })
})