import { ControllerExecutor } from "../../src/engine/controller-executor"
import { ControllerFactory } from "../../src/engine/factory"
import { DefaultDependencyResolver, DefaultIdentifierResolver, DefaultPathResolver } from "../../src/resolver"
import { JsonActionResult, ViewActionResult, RedirectActionResult, FileActionResult, ApiActionResult } from "../../src/controller"
import { RequiredValidator, RangeValidator, EmailValidator, TypeValidator, ValidatorImpl } from "../../src/validator"
import { MetaDataLoader } from "../../src/metadata-loader/metadata-loader"
import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as H from "../helper"
import * as Sinon from "sinon"
import * as Core from "../../src/core"
import * as Util from "util"
import { Kamboja } from "../../src/kamboja"

let HttpRequest: any = {
    body: {},
    getParam: (key: string) => { },
}

describe("ControllerExecutor", () => {

    describe("General", () => {
        it("Should not error if validators in facade is null", async () => {
            let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnView")[0]
            info.classId = info.qualifiedClassName
            Kamboja.getOptions({ rootPath: __dirname, validators: null })
            let builder = new ControllerFactory(info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = <ViewActionResult>await executor.execute([])
            Chai.expect(result).not.null
        })

        it("Should accept validator by its qualified class name", async () => {
            let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "customValidationTest")[0]
            info.classId = info.qualifiedClassName
            Kamboja.getOptions({
                rootPath: __dirname,
                validators: ["CustomValidation, validator/custom-validator"]
            })
            let builder = new ControllerFactory(info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = <JsonActionResult>await executor.execute(["par1"])
            Chai.expect(result.body).deep.eq([{ field: 'any.field', message: 'This is error' }])
        })
    })

    describe("Controller", () => {

        it("Should return View properly", async () => {
            let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnView")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = <ViewActionResult>await executor.execute([])
            Chai.expect(result.viewName).eq("index")
        })

        it("Should return File properly", async () => {
            let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnFile")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = <FileActionResult>await executor.execute([])
            Chai.expect(result.filePath).eq("/go/go/kamboja.js")
        })

        it("Should return Redirect properly", async () => {
            let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnRedirect")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = <RedirectActionResult>await executor.execute([])
            Chai.expect(result.redirectUrl).eq("/go/go/kamboja.js")
        })

        it("Should set cookie properly", async () => {
            let meta = H.fromFile("controller/controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "setTheCookie")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = <ViewActionResult>await executor.execute([])
            Chai.expect(result.cookies[0]).deep.eq({ key: "TheKey", value: "TheValue", options: { expires: true } })
        })
    })

    describe("ApiController", () => {

        it("Should return value properly", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = <JsonActionResult>await executor.execute(["param1"])
            Chai.expect(result.body).eq("param1")
        })

        it("Should able to return value with Promise", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnTheParamWithPromise")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = <JsonActionResult>await executor.execute(["param1"])
            Chai.expect(result.body).eq("param1")
        })

        it("Should auto validate properly", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "validationTest")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = <JsonActionResult>await executor.execute([])
            Chai.expect(result.body).deep.eq([{ field: 'required', message: '[required] is required' }])
        })

        it("Should not auto validate if the setting is turned off", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "validationTest")[0]
            info.classId = info.qualifiedClassName
            Kamboja.getOptions({
                rootPath: __dirname,
                autoValidation: false
            })
            let builder = new ControllerFactory(info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = <JsonActionResult>await executor.execute([])
            Chai.expect(result.body).eq("OK")
        })

        it("Should able to use VOID method", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "voidMethod")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result = await executor.execute([])
            Chai.expect(result).undefined
        })

        it("Should able to return ActionResult (ok/invalid)", async () => {
            let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnOk")[0]
            info.classId = info.qualifiedClassName
            let builder = new ControllerFactory(info)
            let executor = new ControllerExecutor(builder, HttpRequest)
            let result: ApiActionResult = await executor.execute([])
            Chai.expect(result.body).eq("OK!")
        })
    })
})