import { RequestHandler } from "../../src/request-handler/request-handler"
import * as Transformer from "../../src/route-generator/transformers"
import { CustomValidation } from "./validator/custom-validator"
import * as Chai from "chai"
import * as H from "../helper"
import * as Sinon from "sinon"
import * as Core from "../../src/core"

class HttpResponse implements Core.HttpResponse {
    setCookie(key: string, value: string, option?: Core.CookieOptions) { }
    status(status: number, message?: string) { }
    json(body, status?: number) { }
    jsonp(body, status?: number) { }
    error(error, status?: number) { }
    view(name, model?) { }
    redirect(url: string) { }
    file(path: string) { }
    end() { }
};

class HttpRequest implements Core.HttpRequest {
    httpVersion: string
    httpMethod: Core.HttpMethod
    headers: { [key: string]: string }
    cookies: { [key: string]: string }
    params: { [key: string]: string }
    body: any
    referrer: string
    url: string
    getHeader(key: string): string { return }
    getCookie(key: string): string { return }
    getParam(key: string): string { return }
}

describe("RequestHandler", () => {
    let responseMock: H.Spies<HttpResponse>
    let httpResponse: HttpResponse
    let requestMock: H.Stubs<HttpRequest>
    let httpRequest: HttpRequest
    let facade: Core.Facade;

    beforeEach(() => {
        responseMock = H.spy(new HttpResponse());
        httpResponse = <HttpResponse><any>responseMock
        requestMock = H.stub(new HttpRequest())
        httpRequest = <HttpRequest><any>requestMock
        facade = H.createFacade()
    })

    afterEach(() => {
        H.restore(responseMock)
        H.restore(requestMock)
    })

    describe("General Functions", () => {

    })

    describe("ApiController Functions", () => {
        it("Should execute API controller properly", async () => {
            let meta = H.fromFile("test/request-handler/controller/api-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
            info.classId = info.qualifiedClassName
            requestMock.getParam.withArgs("par1").returns("param1")
            let executor = new RequestHandler(facade, info, httpRequest, httpResponse)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("param1")
        })

        it("Should handle internal error inside controller properly", async () => {
            let meta = H.fromFile("test/request-handler/controller/api-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "internalError")[0]
            info.classId = info.qualifiedClassName
            let executor = new RequestHandler(facade, info, httpRequest, httpResponse)
            await executor.execute()
            let result = responseMock.error.getCall(0).args[0]
            Chai.expect(result.message).contains("Internal error from DummyApi")
        })

        it("Should handle return VOID type of action", async () => {
            let meta = H.fromFile("test/request-handler/controller/api-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "voidMethod")[0]
            info.classId = info.qualifiedClassName
            let executor = new RequestHandler(facade, info, httpRequest, httpResponse)
            await executor.execute()
            Chai.expect(responseMock.end.called).true
        })
    })

    describe("Controller Functions", () => {
        it("Should handle controller execution properly", async () => {
            let meta = H.fromFile("test/request-handler/controller/controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnFile")[0]
            info.classId = info.qualifiedClassName
            let executor = new RequestHandler(facade, info, httpRequest, httpResponse)
            await executor.execute()
            let result = responseMock.file.getCall(0).args[0]
            Chai.expect(result).eq("/go/go/kamboja.js")
        })

        it("Should set cookie to the response properly", async () => {
            let meta = H.fromFile("test/request-handler/controller/controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "setTheCookie")[0]
            info.classId = info.qualifiedClassName
            let executor = new RequestHandler(facade, info, httpRequest, httpResponse)
            await executor.execute()
            let result = responseMock.setCookie.getCall(0).args
            Chai.expect(result).deep.eq(['TheKey', 'TheValue', { expires: true }])
        })

        it("Should handle error properly on controller when return non ActionResult", async () => {
            let meta = H.fromFile("test/request-handler/controller/controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnNonActionResult")[0]
            info.classId = info.qualifiedClassName
            let executor = new RequestHandler(facade, info, httpRequest, httpResponse)
            await executor.execute()
            let result = responseMock.error.getCall(0).args[0]
            Chai.expect(result.message).eq("Controller not return type of ActionResult in [DummyApi.returnNonActionResult test/request-handler/controller/controller.js]")
        })
    })

    describe("Validation Functions", () => {
        it("Should handle validation properly", async () => {
            let meta = H.fromFile("test/request-handler/controller/controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "validationTest")[0]
            info.classId = info.qualifiedClassName
            requestMock.getParam.withArgs("age").returns(undefined)
            let executor = new RequestHandler(facade, info, httpRequest, httpResponse)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result[0].field).eq("age")
            Chai.expect(result[0].message).contain("required")
        })
        it("Should not error when provided null validator commands", async () => {
            let meta = H.fromFile("test/request-handler/controller/api-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
            info.classId = info.qualifiedClassName
            requestMock.getParam.withArgs("par1").returns("param1")
            let executor = new RequestHandler(facade, info, httpRequest, httpResponse)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("param1")
        })
    })

    describe.only("Interception Function", () => {
        it("Should execute global interception on every actions", async () => {
            let meta = H.fromFile("test/request-handler/controller/api-controller.js")
            let infos = Transformer.transform(meta)
            facade.interceptors = ["ChangeToHello, test/request-handler/interceptor/change-to-hello"]
            //returnTheParam
            let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
            info.classId = info.qualifiedClassName
            requestMock.getParam.withArgs("par1").returns("param1")
            let executor = new RequestHandler(facade, info, httpRequest, httpResponse)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")

            //returnTheParamWithPromise
            info = infos.filter(x => x.methodMetaData.name == "returnTheParamWithPromise")[0]
            info.classId = info.qualifiedClassName
            requestMock.getParam.withArgs("par1").returns("param1")
            executor = new RequestHandler(facade, info, httpRequest, httpResponse)
            await executor.execute()
            result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")

            //voidMethod
            info = infos.filter(x => x.methodMetaData.name == "voidMethod")[0]
            info.classId = info.qualifiedClassName
            executor = new RequestHandler(facade, info, httpRequest, httpResponse)
            await executor.execute()
            result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")

            //internalError
            info = infos.filter(x => x.methodMetaData.name == "internalError")[0]
            info.classId = info.qualifiedClassName
            executor = new RequestHandler(facade, info, httpRequest, httpResponse)
            await executor.execute()
            result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")
        })
    })
})