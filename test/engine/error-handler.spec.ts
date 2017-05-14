import * as Chai from "chai"
import * as H from "../helper"
import * as Sinon from "sinon"
import * as Core from "../../src/core"
import { Engine, Resolver } from "../../src"
import * as Transformer from "../../src/route-generator/transformers"

describe("ErrorHandler", () => {
    let responseMock: H.Spies<H.HttpResponse>
    let httpResponse: H.HttpResponse
    let requestMock: H.Stubs<H.HttpRequest>
    let httpRequest: H.HttpRequest
    let facade: Core.Facade

    beforeEach(() => {
        responseMock = H.spy(new H.HttpResponse());
        httpResponse = <H.HttpResponse><any>responseMock
        requestMock = H.stub(new H.HttpRequest())
        httpRequest = <H.HttpRequest><any>requestMock
        facade = H.createFacade(__dirname)
    })

    afterEach(() => {
        H.restore(responseMock)
        H.restore(requestMock)
    })

    it("Should overrideable via KambojaOption", () => {
        let error = { status: 500, message: "Fatal error" }
        let option = {
            rootPath: __dirname,
            errorHandler: (e: Core.HttpError) => {
                Chai.expect(e.error).deep.eq({ status: 500, message: "Fatal error" })
            }
        }
        let engine = new Engine.ErrorHandler(error, option, httpRequest, httpResponse)
        engine.execute()
    })

    it("Should render error view on Controller error", () => {
        let meta = H.fromFile("controller/controller.js", new Resolver.DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnNonActionResult")[0]
        let error = { status: 500, message: "Fatal error", routeInfo: info }
        let engine = new Engine.ErrorHandler(error, { rootPath: __dirname }, httpRequest, httpResponse)
        engine.execute()
        let view = responseMock.view.getCall(0).args[0]
        let status = responseMock.status.getCall(0).args[0]
        Chai.expect(view).eq("error")
        Chai.expect(status).eq(500)
    })

    it("Should return json on ApiController error", () => {
        let meta = H.fromFile("controller/api-controller.js", new Resolver.DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
        let error = { status: 500, message: "Fatal error", routeInfo: info }
        let engine = new Engine.ErrorHandler(error, { rootPath: __dirname }, httpRequest, httpResponse)
        engine.execute()
        let body = responseMock.json.getCall(0).args[0]
        let status = responseMock.status.getCall(0).args[0]
        Chai.expect(body).eq("Fatal error")
        Chai.expect(status).eq(500)
    })

    it("Should return xml when request content type is xml and no routeInfo specified", () => {
        let error = { status: 500, message: "Fatal error" }
        requestMock.getHeader.withArgs("Content-Type").returns("text/xml")
        let engine = new Engine.ErrorHandler(error, { rootPath: __dirname }, httpRequest, httpResponse)
        engine.execute()
        let contentType = responseMock.setContentType.getCall(0).args[0]
        let body = responseMock.send.getCall(0).args[0]
        let status = responseMock.status.getCall(0).args[0]
        Chai.expect(contentType).eq("text/xml")
        Chai.expect(body).eq("Fatal error")
        Chai.expect(status).eq(500)
    })

    it("Should return json when request content type is application/json and no routeInfo specified", () => {
        let error = { status: 500, message: "Fatal error" }
        requestMock.getHeader.withArgs("Content-Type").returns("application/json")
        let engine = new Engine.ErrorHandler(error, { rootPath: __dirname }, httpRequest, httpResponse)
        engine.execute()
        let body = responseMock.json.getCall(0).args[0]
        let status = responseMock.json.getCall(0).args[1]
        Chai.expect(body).eq("Fatal error")
        Chai.expect(status).eq(500)
    })
})