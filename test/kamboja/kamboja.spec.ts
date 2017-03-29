import * as Chai from "chai"
import { Kamboja } from "../../src"
import * as Sinon from "sinon"
import { ValidatorBase } from "../../src/validator/baseclasses"
import * as Kecubung from "kecubung"
import { ValidationError, KambojaOption, FieldValidatorArg } from "../../src/core"
import { DefaultDependencyResolver, DefaultIdentifierResolver, DefaultPathResolver } from "../../src/resolver"
import { MetaDataLoader } from "../../src/metadata-loader/metadata-loader"
let engine = {
    init: () => { }
}

class FakeValidator extends ValidatorBase {
    validate(arg: FieldValidatorArg): ValidationError[] {
        return;
    }
}

describe("Kamboja", () => {
    let initSpy: Sinon.SinonSpy;
    beforeEach(() => {
        initSpy = Sinon.spy(engine, "init")
    })

    afterEach(() => {
        initSpy.restore()
    })

    it("Should provide default options", () => {
        (<any>Kamboja).options = undefined
        let option = Kamboja.getOptions()
        Chai.expect(option.autoValidation).true
        Chai.expect(option.controllerPaths).deep.eq(["controller"])
        Chai.expect(option.dependencyResolver instanceof DefaultDependencyResolver).true
        Chai.expect(option.identifierResolver instanceof DefaultIdentifierResolver).true
        Chai.expect(option.pathResolver instanceof DefaultPathResolver).true
        Chai.expect(option.errorHandler).not.null
        Chai.expect(option.interceptors).undefined
        Chai.expect(option.modelPath).eq("model")
        Chai.expect(option.showConsoleLog).true
        Chai.expect(option.skipAnalysis).false
        Chai.expect(option.staticFilePath).eq("public")
        Chai.expect(option.validators).undefined
        Chai.expect(option.viewEngine).eq("hbs")
        Chai.expect(option.viewPath).eq("view")
    })

    it("Should able to override the static options", () => {
        let option = Kamboja.getOptions({
            autoValidation: false,
            controllerPaths: ["api"],
            rootPath: __dirname
        })
        Chai.expect(option.autoValidation).false
        Chai.expect(option.controllerPaths).deep.eq(["api"])
        Chai.expect(option.dependencyResolver instanceof DefaultDependencyResolver).true
        Chai.expect(option.identifierResolver instanceof DefaultIdentifierResolver).true
        Chai.expect(option.pathResolver instanceof DefaultPathResolver).true
        Chai.expect(option.errorHandler).not.null
        Chai.expect(option.interceptors).undefined
        Chai.expect(option.modelPath).eq("model")
        Chai.expect(option.rootPath).eq(__dirname)
        Chai.expect(option.showConsoleLog).true
        Chai.expect(option.skipAnalysis).false
        Chai.expect(option.staticFilePath).eq("public")
        Chai.expect(option.validators).undefined
        Chai.expect(option.viewEngine).eq("hbs")
        Chai.expect(option.viewPath).eq("view")
    })

    it("Should run if no error", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname
        })
        kamboja.init()
        let result = initSpy.getCall(0).args
        Chai.expect(result.length).eq(2)
    })

    it("Should ok if no model defined", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname
        })
        kamboja.init()
        let result = initSpy.getCall(0).args
        Chai.expect(result.length).eq(2)
    })

    it("Should throw if provided model directory not exists", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            modelPath: "not/a/valid/path"
        })
        Chai.expect(() => {
            kamboja.init()
        }).throw("Fatal error")
    })

    it("Should throw if controller path not found", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            controllerPaths: ["path/of/nowhere"]
        })
        Chai.expect(() => kamboja.init()).throw()
    })

    it("Should throw if no controller found", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            controllerPaths: ["folder-without-controllers"],
        })
        Chai.expect(() => kamboja.init()).throw()
    })

    it("Should throw if analysis failure", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            controllerPaths: ["controller-with-errors"],
        })
        Chai.expect(() => kamboja.init()).throw()
    })

    it("Should throw if valid controller found", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            controllerPaths: ["controller-not-exported"],
        })
        Chai.expect(() => kamboja.init()).throw()
    })

    it("Should merge validators properly", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            validators: [
                new FakeValidator()
            ]
        })
        kamboja.init()
        let result: KambojaOption = initSpy.getCall(0).args[1]
    })

    it("Should able to hide log detail", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            showConsoleLog: false
        })
        kamboja.init()
        let result: KambojaOption = initSpy.getCall(0).args[1]
    })

    it("Should provide options from outside", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
        })
        kamboja.init()
        let options = Kamboja.getOptions();
        let storage = options.metaDataStorage;
        Chai.expect(storage).not.null;
    })

})