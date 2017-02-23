import { ControllerExecutor } from "../../src/request-handler/controller-executor"
import { DefaultDependencyResolver, DefaultIdentifierResolver } from "../../src/resolver"
import { JsonActionResult, ViewActionResult, RedirectActionResult, FileActionResult } from "../../src/controller"
import { RequiredValidator, RangeValidator, EmailValidator, TypeValidator, ValidatorImpl } from "../../src/validator"
import { MetaDataLoader } from "../../src/metadata-loader/metadata-loader"
import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as H from "../helper"
import * as Sinon from "sinon"
import * as Core from "../../src/core"

let HttpRequest: any = {
    body: {},
    getParam: (key: string) => { }
}

describe("ControllerExecutor", () => {
    let validators: Core.ValidatorCommand[];
    let facade: Core.Facade;

    beforeEach(() => {
        validators = [
            new RequiredValidator(),
            new RangeValidator(),
            new EmailValidator()
        ]
        facade = {
            identifierResolver: new DefaultIdentifierResolver(),
            dependencyResolver: new DefaultDependencyResolver(new DefaultIdentifierResolver()),
            metaDataStorage: new MetaDataLoader(new DefaultIdentifierResolver()),
            validators: validators
        }
        let typeValidator = new TypeValidator(facade.metaDataStorage);
        validators.push(typeValidator)
    })

    describe("General", () => {
        it("Should throw when provided invalid class name", async () => {
            let meta = H.fromFile("test/request-handler/controller/controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnView")[0]
            info.classId = info.qualifiedClassName = "NoNQualifiedName, non/valid/path"
            let executor = new ControllerExecutor(facade, info, HttpRequest)
            try {
                let result = <ViewActionResult>await executor.execute([])
            }
            catch (e) {
                Chai.expect(e.message).eq("Can not instantiate [NoNQualifiedName, non/valid/path] as Controller")
            }
        })

        it("Should not error if validators in facade is null", async () => {
            let meta = H.fromFile("test/request-handler/controller/controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnView")[0]
            info.classId = info.qualifiedClassName
            facade.validators = null
            let executor = new ControllerExecutor(facade, info, HttpRequest)
            let result = <ViewActionResult>await executor.execute([])
            Chai.expect(result).not.null
        })

        it("Should accept validator by its qualified class name", async () => {
            let meta = H.fromFile("test/request-handler/controller/controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "customValidationTest")[0]
            info.classId = info.qualifiedClassName
            facade.validators.push("CustomValidation, test/request-handler/validator/custom-validator")
            let executor = new ControllerExecutor(facade, info, HttpRequest)
            let result = <JsonActionResult>await executor.execute(["par1"])
            Chai.expect(result.body).deep.eq([ { field: 'any.field', message: 'This is error' } ])
        })

        it("Should throw when provided invalid class name", async () => {
            let meta = H.fromFile("test/request-handler/controller/controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "customValidationTest")[0]
            info.classId = info.qualifiedClassName
            facade.validators.push("InvalidName, invalid/path")
            let executor = new ControllerExecutor(facade, info, HttpRequest)
            try {
                let result = <JsonActionResult>await executor.execute(["par1"])
            }
            catch (e) {
                Chai.expect(e.message).eq("Can not instantiate custom validator [InvalidName, invalid/path]")
            }
        })
    })

    describe("Controller", () => {
        it("Should return View properly", async () => {
            let meta = H.fromFile("test/request-handler/controller/controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnView")[0]
            info.classId = info.qualifiedClassName
            let executor = new ControllerExecutor(facade, info, HttpRequest)
            let result = <ViewActionResult>await executor.execute([])
            Chai.expect(result.viewName).eq("index")
        })

        it("Should return File properly", async () => {
            let meta = H.fromFile("test/request-handler/controller/controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnFile")[0]
            info.classId = info.qualifiedClassName
            let executor = new ControllerExecutor(facade, info, HttpRequest)
            let result = <FileActionResult>await executor.execute([])
            Chai.expect(result.filePath).eq("/go/go/kamboja.js")
        })

        it("Should return Redirect properly", async () => {
            let meta = H.fromFile("test/request-handler/controller/controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnRedirect")[0]
            info.classId = info.qualifiedClassName
            let executor = new ControllerExecutor(facade, info, HttpRequest)
            let result = <RedirectActionResult>await executor.execute([])
            Chai.expect(result.redirectUrl).eq("/go/go/kamboja.js")
        })

        it("Should set cookie properly", async () => {
            let meta = H.fromFile("test/request-handler/controller/controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "setTheCookie")[0]
            info.classId = info.qualifiedClassName
            let executor = new ControllerExecutor(facade, info, HttpRequest)
            let result = <ViewActionResult>await executor.execute([])
            Chai.expect(result.cookies[0]).deep.eq({ key: "TheKey", value: "TheValue", options: { expires: true } })
        })
    })

    describe("ApiController", () => {
        it("Should return value properly", async () => {
            let meta = H.fromFile("test/request-handler/controller/api-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
            info.classId = info.qualifiedClassName
            let executor = new ControllerExecutor(facade, info, HttpRequest)
            let result = <JsonActionResult>await executor.execute(["param1"])
            Chai.expect(result.body).eq("param1")
        })

        it("Should able to return value with Promise", async () => {
            let meta = H.fromFile("test/request-handler/controller/api-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "returnTheParamWithPromise")[0]
            info.classId = info.qualifiedClassName
            let executor = new ControllerExecutor(facade, info, HttpRequest)
            let result = <JsonActionResult>await executor.execute(["param1"])
            Chai.expect(result.body).eq("param1")
        })

        it("Should able to use VOID method", async () => {
            let meta = H.fromFile("test/request-handler/controller/api-controller.js")
            let infos = Transformer.transform(meta)
            let info = infos.filter(x => x.methodMetaData.name == "voidMethod")[0]
            info.classId = info.qualifiedClassName
            let executor = new ControllerExecutor(facade, info, HttpRequest)
            let result = <JsonActionResult>await executor.execute([])
            Chai.expect(result.body).undefined
        })
    })
})