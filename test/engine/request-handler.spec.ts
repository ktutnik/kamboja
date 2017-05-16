import { RequestHandler } from "../../src/engine/request-handler"
import * as Transformer from "../../src/route-generator/transformers"
import { CustomValidation } from "./validator/custom-validator"
import * as Chai from "chai"
import * as H from "../helper"
import * as Sinon from "sinon"
import * as Core from "../../src/core"
import { ConcatInterceptor } from "./controller/interception-order-controller"
import { Kamboja } from "../../src/kamboja"
import { DefaultPathResolver } from "../../src/resolver"
import { HttpStatusError, JsonActionResult } from "../../src/controller"

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
            let executor = new RequestHandler(facade, httpRequest, httpResponse)
            await executor.execute()
            let result = responseMock.status.getCall(0).args[0]
            let text = responseMock.send.getCall(0).args[0]
            Chai.expect(result).eq(404)
            Chai.expect(text).eq("Requested url not found")
        })

        it("Should allow global interceptor work with request without controller", async () => {
            facade.middlewares = [
                "ChangeToHello, interceptor/change-to-hello"
            ]
            let executor = new RequestHandler(facade, httpRequest, httpResponse)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")
        })

        
    })

    describe("ApiController Functions", () => {
        it("Should execute get(id) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "get")
            requestMock.getParam.withArgs("id").returns("12345")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq(12345)
        })

        it("Should execute list(iOffset, iLimit) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "list")
            requestMock.getParam.withArgs("iOffset").returns("1")
            requestMock.getParam.withArgs("iLimit").returns("10")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq({
                iOffset: 1,
                iLimit: 10
            })
        })

        it("Should execute add(data) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "add")

            httpRequest.body = {
                message: "HELLO!"
            }
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq({
                message: "HELLO!"
            })
        })

        it("Should execute replace(id, data) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "replace")
            httpRequest.body = {
                message: "HELLO!"
            }
            requestMock.getParam.withArgs("id").returns("12345")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq({
                id: 12345,
                data: {
                    message: "HELLO!"
                }
            })
        })

        it("Should execute modify(id, data) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "modify")
            httpRequest.body = {
                message: "HELLO!"
            }
            requestMock.getParam.withArgs("id").returns("12345")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq({
                id: 12345,
                data: {
                    message: "HELLO!"
                }
            })
        })

        it("Should execute delete(id) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "delete")
            requestMock.getParam.withArgs("id").returns("12345")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq(12345)
        })

        it("Should execute get(id, root) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-custom-parameter-controller.js", "get")
            requestMock.getParam.withArgs("id").returns("12345")
            requestMock.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq({
                id: 12345, root: 12345
            })
        })

        it("Should execute list(iOffset, iLimit, root) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-custom-parameter-controller.js", "list")
            requestMock.getParam.withArgs("iOffset").returns("1")
            requestMock.getParam.withArgs("iLimit").returns("10")
            requestMock.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq({
                iOffset: 1,
                iLimit: 10,
                root: 12345
            })
        })

        it("Should execute add(data, root) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-custom-parameter-controller.js", "add")
            httpRequest.body = {
                message: "HELLO!"
            }
            requestMock.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq({
                root: 12345,
                data: {
                    message: "HELLO!"
                }
            })
        })

        it("Should execute replace(id, data, root) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-custom-parameter-controller.js", "replace")
            httpRequest.body = {
                message: "HELLO!"
            }
            requestMock.getParam.withArgs("id").returns("12345")
            requestMock.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq({
                id: 12345,
                root: 12345,
                data: {
                    message: "HELLO!"
                }
            })
        })

        it("Should execute modify(id, data, root) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-custom-parameter-controller.js", "modify")
            httpRequest.body = {
                message: "HELLO!"
            }
            requestMock.getParam.withArgs("id").returns("12345")
            requestMock.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq({
                id: 12345,
                root: 12345,
                data: {
                    message: "HELLO!"
                }
            })
        })

        it("Should execute delete(id, root) properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-convention-custom-parameter-controller.js", "delete")
            requestMock.getParam.withArgs("id").returns("12345")
            requestMock.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq({
                id: 12345,
                root: 12345
            })
        })

        it("Should execute API controller properly", async () => {
            let info = H.getRouteInfo(facade, "controller/api-controller.js", "returnTheParam")
            requestMock.getParam.withArgs("par1").returns("param1")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("param1")
        })

        it("Should handle return VOID type of action", async () => {
            let info = H.getRouteInfo(facade, "controller/api-controller.js", "voidMethod")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            Chai.expect(responseMock.end.called).true
        })

        it("Should not cache validator result", async () => {
            let info = H.getRouteInfo(facade, "controller/api-controller.js", "validationTest")
            requestMock.getParam.withArgs("required").returns(undefined)
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq([{ field: 'required', message: '[required] is required' }])
            requestMock.getParam.withArgs("required").returns(200)
            await executor.execute()
            let secondResult = responseMock.json.getCall(1).args[0]
            Chai.expect(secondResult).eq("OK")
        })


        describe("Auto Required Validation", () => {
            it("Should require validate on `get` action", async () => {
                let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "get")
                requestMock.getParam.withArgs("id").returns(undefined)
                let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
                await executor.execute()
                let result = responseMock.json.getCall(0).args[0]
                Chai.expect(result).deep.eq([{ field: 'id', message: '[id] is required' }])
            })

            it("Should require validate on `modify` action", async () => {
                let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "modify")
                httpRequest.body = {
                    message: "HELLO!"
                }
                requestMock.getParam.withArgs("id").returns(undefined)
                let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
                await executor.execute()
                let result = responseMock.json.getCall(0).args[0]
                Chai.expect(result).deep.eq([{ field: 'id', message: '[id] is required' }])
            })

            it("Should require validate on `replace` action", async () => {
                let info = H.getRouteInfo(facade, "controller/api-convention-controller.js", "replace")
                httpRequest.body = {
                    message: "HELLO!"
                }
                requestMock.getParam.withArgs("id").returns(undefined)
                let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
                await executor.execute()
                let result = responseMock.json.getCall(0).args[0]
                Chai.expect(result).deep.eq([{ field: 'id', message: '[id] is required' }])
            })
        })
    })

    describe("Controller Functions", () => {
        it("Should handle controller execution properly", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "returnFile")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.file.getCall(0).args[0]
            Chai.expect(result).eq("/go/go/kamboja.js")
        })

        it("Should set cookie to the response properly", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "setTheCookie")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.setCookie.getCall(0).args
            Chai.expect(result).deep.eq(['TheKey', 'TheValue', { expires: true }])
        })
    })

    describe("Validation Functions", () => {

        it("Should handle validation properly", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "validationTest")
            requestMock.getParam.withArgs("age").returns(undefined)
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result[0].field).eq("age")
            Chai.expect(result[0].message).contain("required")
        })
        it("Should not error when provided null validator commands", async () => {
            let info = H.getRouteInfo(facade, "controller/api-controller.js", "returnTheParam")
            requestMock.getParam.withArgs("par1").returns("param1")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("param1")
        })
    })

    describe("Middleware Function", () => {
        it("Should execute global interception on all actions", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            facade.middlewares = [
                "ChangeToHello, interceptor/change-to-hello"
            ]
            //returnTheParam
            let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
            info.classId = info.qualifiedClassName
            requestMock.getParam.withArgs("par1").returns("param1")

            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")

            //returnTheParamWithPromise
            info = infos.filter(x => x.methodMetaData.name == "returnTheParamWithPromise")[0]
            info.classId = info.qualifiedClassName
            requestMock.getParam.withArgs("par1").returns("param1")
            executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")

            //voidMethod
            info = infos.filter(x => x.methodMetaData.name == "voidMethod")[0]
            info.classId = info.qualifiedClassName
            executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")

            //internalError
            info = infos.filter(x => x.methodMetaData.name == "internalError")[0]
            info.classId = info.qualifiedClassName
            executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")
        })

        it("Should execute interception in proper order", async () => {
            let meta = H.fromFile("controller/interception-order-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.classMetaData.name == "InterceptedTestController" && x.methodMetaData.name == "returnHello")[0]
            facade.middlewares = [
                new ConcatInterceptor("4"),
                new ConcatInterceptor("5")
            ]
            info.classId = info.qualifiedClassName

            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("0, 1, 2, 3, 4, 5, Hello")
        })
    })

    describe("Default Error Handler Function", () => {
        it("Should handle error from global error", async () => {
            let executor = new RequestHandler(facade, httpRequest, httpResponse, new HttpStatusError(400))
            await executor.execute()
            let result = responseMock.status.getCall(0).args[0]
            Chai.expect(result).eq(400)
        })

        it("Should handle error from controller error", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "throwError")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let status = responseMock.status.getCall(0).args[0]
            let message = responseMock.send.getCall(0).args[0]
            Chai.expect(status).eq(500)
            Chai.expect(message).eq("Internal error")
        })

        it("Should handle error from middleware error", async () => {
            facade.middlewares = [
                "ErrorInterceptor, interceptor/error-interceptor"
            ]
            let executor = new RequestHandler(facade, httpRequest, httpResponse)
            await executor.execute()
            let status = responseMock.status.getCall(0).args[0]
            let message = responseMock.send.getCall(0).args[0]
            Chai.expect(status).eq(500)
            Chai.expect(message).eq("ERROR INSIDE INTERCEPTOR")
        })

        it("Should handle HttpStatusError properly on controller when return non ActionResult", async () => {
            let info = H.getRouteInfo(facade, "controller/controller.js", "throwStatusError")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let message = responseMock.send.getCall(0).args[0]
            let status = responseMock.status.getCall(0).args[0]
            Chai.expect(message).eq("Not found action")
            Chai.expect(status).eq(404)
        })
    })

    describe("Error Handler Using Middleware", () => {
        it("Should handle error from global error", async () => {
            facade.middlewares = [
                "ErrorHandlerMiddleware, interceptor/error-handler"
            ]
            let executor = new RequestHandler(facade, httpRequest, httpResponse, new HttpStatusError(400))
            await executor.execute()
            let status = responseMock.status.getCall(0).args[0]
            let message = responseMock.send.getCall(0).args[0]
            Chai.expect(status).eq(501)
            Chai.expect(message).eq("Error handled properly")
        })

        it("Should handle error from controller error", async () => {
            facade.middlewares = [
                "ErrorHandlerMiddleware, interceptor/error-handler"
            ]
            let info = H.getRouteInfo(facade, "controller/controller.js", "throwError")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let status = responseMock.status.getCall(0).args[0]
            let message = responseMock.send.getCall(0).args[0]
            Chai.expect(status).eq(501)
            Chai.expect(message).eq("Error handled properly")
        })

        it("Should handle error from middleware error", async () => {
            facade.middlewares = [
                "ErrorHandlerMiddleware, interceptor/error-handler",
                "ErrorInterceptor, interceptor/error-interceptor"
            ]
            let executor = new RequestHandler(facade, httpRequest, httpResponse)
            await executor.execute()
            let status = responseMock.status.getCall(0).args[0]
            let message = responseMock.send.getCall(0).args[0]
            Chai.expect(status).eq(501)
            Chai.expect(message).eq("Error handled properly")
        })

        it("Should handle HttpStatusError properly on controller when return non ActionResult", async () => {
            facade.middlewares = [
                "ErrorHandlerMiddleware, interceptor/error-handler"
            ]
            let info = H.getRouteInfo(facade, "controller/controller.js", "throwStatusError")
            let executor = new RequestHandler(facade, httpRequest, httpResponse, info)
            await executor.execute()
            let message = responseMock.send.getCall(0).args[0]
            let status = responseMock.status.getCall(0).args[0]
            Chai.expect(status).eq(501)
            Chai.expect(message).eq("Error handled properly")
        })
    })
})