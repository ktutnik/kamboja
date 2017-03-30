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


})