import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as H from "../helper"
import * as Sinon from "sinon"
import * as Core from "../../src/core"
import * as Util from "util"
import { ControllerFactory } from "../../src/engine/controller-factory"
import { ControllerExecutor } from "../../src/engine/controller-executor"
import {
    Kamboja, Resolver, ApiActionResult
} from "../../src"

let HttpRequest: any = {
    body: {},
    getParam: (key: string) => { },
}

describe("ControllerExecutor", () => {
    let facade: Core.Facade;
    beforeEach(() => {
        facade = H.createFacade(__dirname)
    })

    describe("General", () => {
        it("Should not error if validators in facade is null", async () => {
            let meta = H.fromFile("controller/controller.js", new Resolver.DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnActionResult")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(facade, info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = await executor.execute([])
            Chai.expect(result).not.null
        })

        it("Should accept validator by its qualified class name", async () => {
            let meta = H.fromFile("controller/controller.js", new Resolver.DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "customValidationTest")[0]
            info.classId = info.qualifiedClassName
            facade.validators = ["CustomValidation, validator/custom-validator"]
            let builder = new ControllerFactory(facade, info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = await executor.execute(["par1"])
            Chai.expect(result).deep.eq([{ field: 'any.field', message: 'This is error' }])
        })
    })

    describe("Controller", () => {

        it("Should set cookie properly", async () => {
            let meta = H.fromFile("controller/controller.js", new Resolver.DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "setTheCookie")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(facade, info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = <Core.ActionResult>await executor.execute([])
            Chai.expect(result.cookies[0]).deep.eq({ key: "TheKey", value: "TheValue", options: { expires: true } })
        })
    })

    describe("ApiController", () => {

        it("Should return value properly", async () => {
            let meta = H.fromFile("controller/api-controller.js", new Resolver.DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(facade, info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = await executor.execute(["param1"])
            Chai.expect(result).eq("param1")
        })

        it("Should able to return value with Promise", async () => {
            let meta = H.fromFile("controller/api-controller.js", new Resolver.DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnTheParamWithPromise")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(facade, info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = await executor.execute(["param1"])
            Chai.expect(result).eq("param1")
        })

        it("Should auto validate properly", async () => {
            let meta = H.fromFile("controller/api-controller.js", new Resolver.DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "validationTest")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(facade, info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = await executor.execute([])
            Chai.expect(result.body).deep.eq([{ field: 'required', message: '[required] is required' }])
        })

        it("Should not execute action if in auto validate", async () => {
            let meta = H.fromFile("controller/api-controller.js", new Resolver.DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "validationTestThrowError")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(facade, info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let error = false;
            try {
                let result = await executor.execute([])
            }
            catch(e){
                error = true;
            }
            Chai.expect(error).false
        })

        it("Should not auto validate if the setting is turned off", async () => {
            let meta = H.fromFile("controller/api-controller.js", new Resolver.DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "validationTest")[0]
            info.classId = info.qualifiedClassName
            facade.autoValidation = false
            let builder = new ControllerFactory(facade, info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = await executor.execute([])
            Chai.expect(result).eq("OK")
        })

        it("Should able to use VOID method", async () => {
            let meta = H.fromFile("controller/api-controller.js", new Resolver.DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "voidMethod")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(facade, info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = await executor.execute([])
            Chai.expect(result).undefined
        })

        it("Should able to return ActionResult (ok/invalid)", async () => {
            let meta = H.fromFile("controller/api-controller.js", new Resolver.DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnOk")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(facade, info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result: ApiActionResult = await executor.execute([])
            Chai.expect(result.body).eq("OK!")
        })
    })
})