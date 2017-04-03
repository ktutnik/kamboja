import { RequestHandler } from "../../src/engine/request-handler"
import { ControllerFactory } from "../../src/engine/factory"
import * as Transformer from "../../src/route-generator/transformers"
import { CustomValidation } from "./validator/custom-validator"
import * as Chai from "chai"
import * as H from "../helper"
import * as Sinon from "sinon"
import * as Core from "../../src/core"
import { ConcatInterceptor } from "./controller/interception-order-controller"
import { Kamboja } from "../../src/kamboja"
import { DefaultPathResolver } from "../../src/resolver"

describe("RequestHandler", () => {
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

    describe("General Functions", () => {
        it("Should handle 404 properly", async () => {
            let container = new ControllerFactory(facade)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            let result = responseMock.status.getCall(0).args[0]
            Chai.expect(result).eq(404)
            Chai.expect(responseMock.end.called).true
        })

        it("Should allow global interceptor work with request without controller", async () => {
            facade.interceptors = [
                "ChangeToHello, interceptor/change-to-hello"
            ]
            let container = new ControllerFactory(facade)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")
        })

        
    })

    describe("ApiController Functions", () => {
        it("Should execute API controller properly", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            requestMock.getParam.withArgs("par1").returns("param1")
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("param1")
        })

        it("Should handle internal error inside controller properly", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "internalError")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            let result = responseMock.error.getCall(0).args[0]
            Chai.expect(result.message).contains("Internal error from DummyApi")
        })

        it("Should handle return VOID type of action", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "voidMethod")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            Chai.expect(responseMock.end.called).true
        })

        it("Should not cache validator result", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "validationTest")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            requestMock.getParam.withArgs("required").returns(undefined)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq([{ field: 'required', message: '[required] is required' }])
            requestMock.getParam.withArgs("required").returns(200)
            await executor.execute()
            let secondResult = responseMock.json.getCall(1).args[0]
            Chai.expect(secondResult).eq("OK")
        })
    })

    describe("Controller Functions", () => {
        it("Should handle controller execution properly", async () => {
            let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnFile")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            let result = responseMock.file.getCall(0).args[0]
            Chai.expect(result).eq("/go/go/kamboja.js")
        })

        it("Should set cookie to the response properly", async () => {
            let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "setTheCookie")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            let result = responseMock.setCookie.getCall(0).args
            Chai.expect(result).deep.eq(['TheKey', 'TheValue', { expires: true }])
        })

        it("Should handle error properly on controller when return non ActionResult", async () => {
            let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnNonActionResult")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            let result = responseMock.error.getCall(0).args[0]
            Chai.expect(result.message).eq("Controller not return type of ActionResult in [DummyApi.returnNonActionResult controller/controller.js]")
        })
    })

    describe("Validation Functions", () => {

        it("Should handle validation properly", async () => {
            let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "validationTest")[0]
            info.classId = info.qualifiedClassName
            requestMock.getParam.withArgs("age").returns(undefined)
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result[0].field).eq("age")
            Chai.expect(result[0].message).contain("required")
        })
        it("Should not error when provided null validator commands", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
            info.classId = info.qualifiedClassName
            requestMock.getParam.withArgs("par1").returns("param1")
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("param1")
        })
    })

    describe("Interception Function", () => {

        it("Should provide hasController properly", async () => {
            facade.interceptors = [
                "CheckHasController, interceptor/check-has-controller"
            ]
            let container = new ControllerFactory(facade)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("DOESN'T HAVE CONTROLLER")
        })

        it("Should give proper error if uncaught error occur inside interceptor", async () => {
            facade.interceptors = [
                "ErrorInterceptor, interceptor/error-interceptor"
            ]
            let container = new ControllerFactory(facade)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            let result = responseMock.error.getCall(0).args[0]
            Chai.expect(result.message).eq("ERROR INSIDE INTERCEPTOR")
        })

        it("Should execute global interception on all actions", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            facade.interceptors = [
                "ChangeToHello, interceptor/change-to-hello"
            ]
            //returnTheParam
            let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
            info.classId = info.qualifiedClassName
            requestMock.getParam.withArgs("par1").returns("param1")
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")

            //returnTheParamWithPromise
            info = infos.filter(x => x.methodMetaData.name == "returnTheParamWithPromise")[0]
            info.classId = info.qualifiedClassName
            requestMock.getParam.withArgs("par1").returns("param1")
            container = new ControllerFactory(facade, info)
            executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")

            //voidMethod
            info = infos.filter(x => x.methodMetaData.name == "voidMethod")[0]
            info.classId = info.qualifiedClassName
            container = new ControllerFactory(facade, info)
            executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")

            //internalError
            info = infos.filter(x => x.methodMetaData.name == "internalError")[0]
            info.classId = info.qualifiedClassName
            container = new ControllerFactory(facade, info)
            executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")
        })

        it("Should execute interception in proper order", async () => {
            let meta = H.fromFile("controller/interception-order-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            facade.interceptors = [
                new ConcatInterceptor("4"),
                new ConcatInterceptor("5")
            ]
            let info = infos.filter(x => x.classMetaData.name == "InterceptedTestController" && x.methodMetaData.name == "returnHello")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname})
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("0, 1, 2, 3, 4, 5, Hello")
        })
    })
})