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
            let container = new ControllerFactory(facade)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
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
            let container = new ControllerFactory(facade)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")
        })

        it("Should Include routeInfo on the Error passed", async () => {
            let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "throwError")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let error = responseMock.error.getCall(0).args[0]
            let status = responseMock.error.getCall(0).args[1]
            Chai.expect((<Core.RouteInfo>error.routeInfo).methodMetaData.name).eq("throwError")
            Chai.expect(status).eq(500)
        })

        it("Should Include routeInfo on the Error passed with interceptor", async () => {
            facade.middlewares = [
                "DefaultInterceptor, interceptor/default-interceptor"
            ]
            let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "throwError")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let error = responseMock.error.getCall(0).args[0]
            let status = responseMock.error.getCall(0).args[1]
            Chai.expect((<Core.RouteInfo>error.routeInfo).methodMetaData.name).eq("throwError")
            Chai.expect(status).eq(500)
        })

        it("Should not include routeInfo when error occur on non handled request", async () => {
            facade.middlewares = [
                "ErrorInterceptor, interceptor/error-interceptor"
            ]
            let container = new ControllerFactory(facade)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let error = responseMock.error.getCall(0).args[0]
            let status = responseMock.error.getCall(0).args[1]
            Chai.expect(error.message).eq("ERROR INSIDE INTERCEPTOR")
            Chai.expect(status).eq(500)
        })

        it("Should Include controllerInfo on request", async () => {
            let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnView")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = H.cleanUp([httpRequest.controllerInfo])
            Chai.expect(result).deep.eq([{
                initiator: undefined,
                route: undefined,
                httpMethod: undefined,
                methodMetaData: { name: 'returnView' },
                qualifiedClassName: 'DummyApi, controller/controller.js',
                classMetaData: { name: 'DummyApi', baseClass: 'Controller' },
                collaborator: undefined
            }])
        })

        it("Should Include controllerInfo on request with interceptor", async () => {
            facade.middlewares = [
                "ErrorInterceptor, interceptor/error-interceptor"
            ]
            let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnView")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = H.cleanUp([httpRequest.controllerInfo])
            Chai.expect(result).deep.eq([{
                initiator: undefined,
                route: undefined,
                httpMethod: undefined,
                methodMetaData: { name: 'returnView' },
                qualifiedClassName: 'DummyApi, controller/controller.js',
                classMetaData: { name: 'DummyApi', baseClass: 'Controller' },
                collaborator: undefined
            }])
        })

        it("Should node Include controllerInfo on request that doesn't handled by controller", async () => {
            let container = new ControllerFactory(facade)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            Chai.expect(httpRequest.controllerInfo).undefined
        })
    })

    describe("ApiController Functions", () => {
        it("Should execute get(id) properly", async () => {
            let meta = H.fromFile("controller/api-convention-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "get")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            requestMock.getParam.withArgs("id").returns("12345")
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq(12345)
        })

        it("Should execute list(iOffset, iLimit) properly", async () => {
            let meta = H.fromFile("controller/api-convention-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "list")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            requestMock.getParam.withArgs("iOffset").returns("1")
            requestMock.getParam.withArgs("iLimit").returns("10")
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq({
                iOffset: 1,
                iLimit: 10
            })
        })

        it("Should execute add(data) properly", async () => {
            let meta = H.fromFile("controller/api-convention-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "add")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            httpRequest.body = {
                message: "HELLO!"
            }
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq({
                message: "HELLO!"
            })
        })

        it("Should execute replace(id, data) properly", async () => {
            let meta = H.fromFile("controller/api-convention-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "replace")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            httpRequest.body = {
                message: "HELLO!"
            }
            requestMock.getParam.withArgs("id").returns("12345")
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
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
            let meta = H.fromFile("controller/api-convention-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "modify")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            httpRequest.body = {
                message: "HELLO!"
            }
            requestMock.getParam.withArgs("id").returns("12345")
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
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
            let meta = H.fromFile("controller/api-convention-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "delete")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            requestMock.getParam.withArgs("id").returns("12345")
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq(12345)
        })

        it("Should execute get(id, root) properly", async () => {
            let meta = H.fromFile("controller/api-convention-custom-parameter-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "get")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            requestMock.getParam.withArgs("id").returns("12345")
            requestMock.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq({
                id: 12345, root: 12345
            })
        })

        it("Should execute list(iOffset, iLimit, root) properly", async () => {
            let meta = H.fromFile("controller/api-convention-custom-parameter-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "list")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            requestMock.getParam.withArgs("iOffset").returns("1")
            requestMock.getParam.withArgs("iLimit").returns("10")
            requestMock.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq({
                iOffset: 1,
                iLimit: 10,
                root: 12345
            })
        })

        it("Should execute add(data, root) properly", async () => {
            let meta = H.fromFile("controller/api-convention-custom-parameter-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "add")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            httpRequest.body = {
                message: "HELLO!"
            }
            requestMock.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
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
            let meta = H.fromFile("controller/api-convention-custom-parameter-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "replace")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            httpRequest.body = {
                message: "HELLO!"
            }
            requestMock.getParam.withArgs("id").returns("12345")
            requestMock.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
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
            let meta = H.fromFile("controller/api-convention-custom-parameter-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "modify")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            httpRequest.body = {
                message: "HELLO!"
            }
            requestMock.getParam.withArgs("id").returns("12345")
            requestMock.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
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
            let meta = H.fromFile("controller/api-convention-custom-parameter-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "delete")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            requestMock.getParam.withArgs("id").returns("12345")
            requestMock.getParam.withArgs("root").returns("12345")
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).deep.eq({
                id: 12345,
                root: 12345
            })
        })

        it("Should execute API controller properly", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            requestMock.getParam.withArgs("par1").returns("param1")
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("param1")
        })

        it("Should handle return VOID type of action", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "voidMethod")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
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
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
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
                let meta = H.fromFile("controller/api-convention-controller.js", new DefaultPathResolver(__dirname))
                let infos = Transformer.transform(meta)
                let info = infos.filter(x => x.methodMetaData.name == "get")[0]
                info.classId = info.qualifiedClassName
                let container = new ControllerFactory(facade, info)
                requestMock.getParam.withArgs("id").returns(undefined)
                let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
                await executor.execute()
                let result = responseMock.json.getCall(0).args[0]
                Chai.expect(result).deep.eq([{ field: 'id', message: '[id] is required' }])
            })

            it("Should require validate on `delete` action", async () => {
                let meta = H.fromFile("controller/api-convention-controller.js", new DefaultPathResolver(__dirname))
                let infos = Transformer.transform(meta)
                let info = infos.filter(x => x.methodMetaData.name == "delete")[0]
                info.classId = info.qualifiedClassName
                let container = new ControllerFactory(facade, info)
                requestMock.getParam.withArgs("id").returns(undefined)
                let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
                await executor.execute()
                let result = responseMock.json.getCall(0).args[0]
                Chai.expect(result).deep.eq([{ field: 'id', message: '[id] is required' }])
            })

            it("Should require validate on `modify` action", async () => {
                let meta = H.fromFile("controller/api-convention-controller.js", new DefaultPathResolver(__dirname))
                let infos = Transformer.transform(meta)
                let info = infos.filter(x => x.methodMetaData.name == "modify")[0]
                info.classId = info.qualifiedClassName
                let container = new ControllerFactory(facade, info)
                httpRequest.body = {
                    message: "HELLO!"
                }
                requestMock.getParam.withArgs("id").returns(undefined)
                let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
                await executor.execute()
                let result = responseMock.json.getCall(0).args[0]
                Chai.expect(result).deep.eq([{ field: 'id', message: '[id] is required' }])
            })

            it("Should require validate on `replace` action", async () => {
                let meta = H.fromFile("controller/api-convention-controller.js", new DefaultPathResolver(__dirname))
                let infos = Transformer.transform(meta)
                let info = infos.filter(x => x.methodMetaData.name == "replace")[0]
                info.classId = info.qualifiedClassName
                let container = new ControllerFactory(facade, info)
                httpRequest.body = {
                    message: "HELLO!"
                }
                requestMock.getParam.withArgs("id").returns(undefined)
                let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
                await executor.execute()
                let result = responseMock.json.getCall(0).args[0]
                Chai.expect(result).deep.eq([{ field: 'id', message: '[id] is required' }])
            })
        })
    })

    describe("Controller Functions", () => {
        it("Should handle controller execution properly", async () => {
            let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnFile")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
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
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.setCookie.getCall(0).args
            Chai.expect(result).deep.eq(['TheKey', 'TheValue', { expires: true }])
        })

        describe("Error Handling", () => {
            it("Should handle error properly on controller when return non ActionResult", async () => {
                let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
                let infos = Transformer.transform(meta)
                let info = infos.filter(x => x.methodMetaData.name == "throwError")[0]
                info.classId = info.qualifiedClassName
                let container = new ControllerFactory(facade, info)
                let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
                await executor.execute()
                let result = responseMock.error.getCall(0).args[0]
                let status = responseMock.error.getCall(0).args[1]
                Chai.expect(result.message).eq("Internal error")
                Chai.expect(status).eq(500)
            })

            it("Should handle HttpStatusError properly on controller when return non ActionResult", async () => {
                let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
                let infos = Transformer.transform(meta)
                let info = infos.filter(x => x.methodMetaData.name == "throwStatusError")[0]
                info.classId = info.qualifiedClassName
                let container = new ControllerFactory(facade, info)
                let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
                await executor.execute()
                let result = responseMock.error.getCall(0).args[0]
                let status = responseMock.error.getCall(0).args[1]
                Chai.expect(result.message).eq("Not found action")
                Chai.expect(status).eq(404)
            })
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
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
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
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("param1")
        })
    })

    describe("Interception Function", () => {
        it("Should provide list of interceptors on http request", async () => {
            let meta = H.fromFile("controller/interception-order-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            facade.middlewares = [
                new ConcatInterceptor("4"),
                new ConcatInterceptor("5")
            ]
            let info = infos.filter(x => x.classMetaData.name == "InterceptedTestController" && x.methodMetaData.name == "returnHello")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            Chai.expect(httpRequest.middlewares.length).eq(6)
        })

        it("Should provide hasController properly", async () => {
            facade.middlewares = [
                "CheckHasController, interceptor/check-has-controller"
            ]
            let container = new ControllerFactory(facade)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("DOESN'T HAVE CONTROLLER")
        })

        it("Should able to use function as interception", async () => {
            let meta = H.fromFile("controller/intercepted-with-function.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "index")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello")
        })

        it("Should able to use function in global interception", async () => {
            let meta = H.fromFile("controller/intercepted-with-function.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "nonIntercepted")[0]
            info.classId = info.qualifiedClassName
            facade.middlewares = [
                async (i) => { return new JsonActionResult("Hello", 501, undefined) }
            ]
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            let status = responseMock.json.getCall(0).args[1]
            Chai.expect(result).eq("Hello")
            Chai.expect(status).eq(501)
        })

        it("Should give proper error if uncaught error occur inside interceptor", async () => {
            facade.middlewares = [
                "ErrorInterceptor, interceptor/error-interceptor"
            ]
            let container = new ControllerFactory(facade)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.error.getCall(0).args[0]
            Chai.expect(result.message).eq("ERROR INSIDE INTERCEPTOR")
        })

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
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")

            //returnTheParamWithPromise
            info = infos.filter(x => x.methodMetaData.name == "returnTheParamWithPromise")[0]
            info.classId = info.qualifiedClassName
            requestMock.getParam.withArgs("par1").returns("param1")
            container = new ControllerFactory(facade, info)
            executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")

            //voidMethod
            info = infos.filter(x => x.methodMetaData.name == "voidMethod")[0]
            info.classId = info.qualifiedClassName
            container = new ControllerFactory(facade, info)
            executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")

            //internalError
            info = infos.filter(x => x.methodMetaData.name == "internalError")[0]
            info.classId = info.qualifiedClassName
            container = new ControllerFactory(facade, info)
            executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("Hello world!")
        })

        it("Should execute interception in proper order", async () => {
            let meta = H.fromFile("controller/interception-order-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            facade.middlewares = [
                new ConcatInterceptor("4"),
                new ConcatInterceptor("5")
            ]
            let info = infos.filter(x => x.classMetaData.name == "InterceptedTestController" && x.methodMetaData.name == "returnHello")[0]
            info.classId = info.qualifiedClassName
            let container = new ControllerFactory(facade, info)
            let executor = new RequestHandler(container, httpRequest, httpResponse, { rootPath: __dirname })
            await executor.execute()
            let result = responseMock.json.getCall(0).args[0]
            Chai.expect(result).eq("0, 1, 2, 3, 4, 5, Hello")
        })
    })
})