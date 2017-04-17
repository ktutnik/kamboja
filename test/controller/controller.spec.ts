import { Controller, ApiController, ApiActionResult, HttpStatusError } from "../../src"
import * as H from "../helper"
import * as Chai from "chai"
import * as Core from "../../src/core"
import * as Sinon from "sinon"
import * as Kecubung from "kecubung"

let RouteInfo: any = <Core.RouteInfo>{
    qualifiedClassName: 'SimpleController, .simple-controller.js',
    methodMetaData: <Kecubung.MethodMetaData>{
        type: 'Method',
        decorators: [],
        name: 'myMethod',
    }
}

let Validator: Core.Validator = {
    isValid: function () { return false },
    getValidationErrors: function () {
        return [{
            field: "field",
            message: "Error message"
        }]
    }
}

describe("Error", () => {
    it("Should instantiate properly", () => {
        let status = new HttpStatusError(undefined);
        Chai.expect(status instanceof HttpStatusError).true
    })

    it("Should instantiate properly", () => {
        
        let status = new HttpStatusError(undefined);
        Chai.expect(status instanceof HttpStatusError).true
    })
})

describe("ActionResult", () => {
    let responseMock: H.Spies<H.HttpResponse>
    let httpResponse: H.HttpResponse
    let requestMock: H.Stubs<H.HttpRequest>
    let httpRequest: H.HttpRequest

    beforeEach(() => {
        responseMock = H.spy(new H.HttpResponse());
        httpResponse = <H.HttpResponse><any>responseMock
        requestMock = H.stub(new H.HttpRequest())
        httpRequest = <H.HttpRequest><any>requestMock
    })

    afterEach(() => {
        H.restore(responseMock)
        H.restore(requestMock)
    })



    it("Should be able to setCookie from result", () => {
        let result = new Core.ActionResult(undefined)
        result.setCookie({ key: "Key", value: "Value" })
        result.execute(httpRequest, httpResponse, null)
        let key = responseMock.setCookie.getCall(0).args[0]
        let value = responseMock.setCookie.getCall(0).args[1]
        Chai.expect(key).eq("Key")
        Chai.expect(value).eq("Value")

    })

    it("Should be able to clearCookie from result", () => {
        let result = new Core.ActionResult([])
        result.removeCookie("key")
        result.execute(httpRequest, httpResponse, null)
        Chai.expect(responseMock.removeCookie.calledOnce).true
    })

    it("Should be able to setContentType from result", () => {
        let result = new Core.ActionResult([])
        result.setContentType("text/xml")
        result.execute(httpRequest, httpResponse, null)
        let contentType = responseMock.setContentType.getCall(0).args[0]
        Chai.expect(contentType).eq("text/xml")
    })
})

describe("ApiController", () => {
    let responseMock: H.Spies<H.HttpResponse>
    let httpResponse: H.HttpResponse
    let requestMock: H.Stubs<H.HttpRequest>
    let httpRequest: H.HttpRequest

    beforeEach(() => {
        responseMock = H.spy(new H.HttpResponse());
        httpResponse = <H.HttpResponse><any>responseMock
        requestMock = H.stub(new H.HttpRequest())
        httpRequest = <H.HttpRequest><any>requestMock
    })

    afterEach(() => {
        H.restore(responseMock)
        H.restore(requestMock)
    })

    it("Should instantiate properly", () => {
        let api = new ApiController();
        Chai.expect(api).not.null;
    })

    it("Should return OK result properly", () => {
        let api = new ApiController();
        let result = api.ok("OK!")
        Chai.expect(result.body).eq("OK!")
        Chai.expect(result.status).eq(200)
    })

    it("Should return INVALID result properly", () => {
        let api = new ApiController();
        let result = api.invalid("NOT OK!")
        Chai.expect(result.body).eq("NOT OK!")
        Chai.expect(result.status).eq(400)
    })

    it("Should return message validation when body not provided in INVALID", () => {
        let api = new ApiController();
        api.validator = Validator
        let result = api.invalid()
        Chai.expect(result.body).deep.eq([{
            field: "field",
            message: "Error message"
        }])
        Chai.expect(result.status).eq(400)
    })

    it("Should return XML if provided text/xml in the accept header", () => {
        let api = new ApiActionResult({ data: "hello" }, 400)
        requestMock.isAccept.withArgs("text/xml").returns(true)
        api.execute(httpRequest, httpResponse, null)
        let status = responseMock.status.getCall(0).args[0]
        let setContent = responseMock.setContentType.getCall(0).args[0]
        let send = responseMock.send.getCall(0).args[0]
        Chai.expect(status).eq(400)
        Chai.expect(setContent).eq("text/xml")
        Chai.expect(send).eq("<data>hello</data>")
    })

    it("Should return XML if provided text/xml in the accept header", () => {
        let api = new ApiActionResult({ data: "hello" }, 400)
        requestMock.isAccept.withArgs("text/xml").returns(true)
        api.execute(httpRequest, httpResponse, null)
        let status = responseMock.status.getCall(0).args[0]
        let setContent = responseMock.setContentType.getCall(0).args[0]
        let send = responseMock.send.getCall(0).args[0]
        Chai.expect(status).eq(400)
        Chai.expect(setContent).eq("text/xml")
        Chai.expect(send).eq("<data>hello</data>")

        //should ok without status & without body
        api = new ApiActionResult(undefined, undefined)
        requestMock.isAccept.withArgs("text/xml").returns(true)
        api.execute(httpRequest, httpResponse, null)
        let endCalled = responseMock.end.calledOnce
        Chai.expect(endCalled).true
    })

    it("Should return JSON by default", () => {
        let api = new ApiActionResult({ data: "hello" }, 400)
        requestMock.isAccept.withArgs("text/xml").returns(false)
        api.execute(httpRequest, httpResponse, null)
        let status = responseMock.status.getCall(0).args[0]
        let send = responseMock.json.getCall(0).args[0]
        Chai.expect(status).eq(400)
        Chai.expect(send).deep.eq({ data: "hello" })

        //should ok without status & without body
        api = new ApiActionResult(undefined, undefined)
        requestMock.isAccept.withArgs("text/xml").returns(false)
        api.execute(httpRequest, httpResponse, null)
        let endCalled = responseMock.end.calledOnce
        Chai.expect(endCalled).true
    })

    it("Should return JSON if provided multiple Accept Header", () => {
        let api = new ApiActionResult({ data: "hello" }, 200)
        requestMock.isAccept.withArgs("text/xml").returns(true)
        requestMock.isAccept.withArgs("application/json").returns(true)
        api.execute(httpRequest, httpResponse, null)
        let status = responseMock.status.getCall(0).args[0]
        let send = responseMock.json.getCall(0).args[0]
        Chai.expect(status).eq(200)
        Chai.expect(send).deep.eq({ data: "hello" })
    })
})

describe("Controller", () => {
    describe("view", () => {
        let spy: Sinon.SinonSpy;
        let HttpResponse = new H.HttpResponse()
        let HttpRequest = new H.HttpRequest()

        beforeEach(() => {
            spy = Sinon.spy(HttpResponse, "view")
        })

        afterEach(() => {
            spy.restore();
        })

        it("Should able to called without view name", () => {
            let controller = new Controller()
            //called without view name
            let view = controller.view({});
            view.execute(HttpRequest, HttpResponse, RouteInfo)
            let viewName = spy.getCall(0).args[0]
            Chai.expect(viewName).eq("simple/mymethod")
        })

        it("Should able to called with view name on controller scope", () => {
            let controller = new Controller()
            let view = controller.view({}, "index");
            view.execute(HttpRequest, HttpResponse, RouteInfo)
            let viewName = spy.getCall(0).args[0]
            Chai.expect(viewName).eq("simple/index")
        })

        it("Should able to called with view name outside controller", () => {
            let controller = new Controller()
            let view = controller.view({}, "other/index");
            view.execute(HttpRequest, HttpResponse, RouteInfo)
            let viewName = spy.getCall(0).args[0]
            Chai.expect(viewName).eq("other/index")
        })

        it("Should provide correct view name when controller name not end with 'controller'", () => {
            let controller = new Controller()
            //called without view name
            let view = controller.view({});
            view.execute(HttpRequest, HttpResponse, <Core.RouteInfo>{
                qualifiedClassName: 'Proud, .simple-controller.js',
                methodMetaData: <Kecubung.MethodMetaData>{
                    name: 'myMethod',
                }
            })
            let viewName = spy.getCall(0).args[0]
            Chai.expect(viewName).eq("proud/mymethod")
        })
    })

    describe("file", () => {
        let spy: Sinon.SinonSpy;
        let HttpResponse = new H.HttpResponse()
        let HttpRequest = new H.HttpRequest()

        beforeEach(() => {
            spy = Sinon.spy(HttpResponse, "file")
        })

        afterEach(() => {
            spy.restore();
        })

        it("Should provide file path properly", () => {
            let controller = new Controller()
            let view = controller.file("./go/go/kamboja.js");
            view.execute(HttpRequest, HttpResponse, RouteInfo)
            let viewName = spy.getCall(0).args[0]
            Chai.expect(viewName).eq("./go/go/kamboja.js")
        })
    })

    describe("redirect", () => {
        let spy: Sinon.SinonSpy;
        let HttpResponse = new H.HttpResponse()
        let HttpRequest = new H.HttpRequest()

        beforeEach(() => {
            spy = Sinon.spy(HttpResponse, "redirect")
        })

        afterEach(() => {
            spy.restore();
        })

        it("Should provide redirect path properly", () => {
            let controller = new Controller()
            let view = controller.redirect("./go/go/kamboja.js");
            view.execute(HttpRequest, HttpResponse, RouteInfo)
            let viewName = spy.getCall(0).args[0]
            Chai.expect(viewName).eq("./go/go/kamboja.js")
        })
    })

    describe("json", () => {
        let spy: Sinon.SinonSpy;
        let HttpResponse = new H.HttpResponse()
        let HttpRequest = new H.HttpRequest()

        beforeEach(() => {
            spy = Sinon.spy(HttpResponse, "json")
        })

        afterEach(() => {
            spy.restore();
        })

        it("Should provide json body properly", () => {
            let controller = new Controller()
            let view = controller.json({ data: "Hello!" });
            view.execute(HttpRequest, HttpResponse, RouteInfo)
            let viewName = spy.getCall(0).args[0]
            Chai.expect(viewName).deep.eq({ data: "Hello!" })
        })
    })
})