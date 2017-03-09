import * as Chai from "chai"
import { Kamboja } from "../../src"
import * as Sinon from "sinon"
import { ValidatorBase } from "../../src/validator/baseclasses"
import * as Kecubung from "kecubung"
import { ValidationError, KambojaOption, FieldValidatorArg } from "../../src/core"

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
            controllerPaths: ["test/kamboja/controller"],
            modelPath: "test/kamboja/model"
        })
        kamboja.init()
        let result = initSpy.getCall(0).args
        Chai.expect(result.length).eq(2)
    })

    it("Should ok if no model defined", () => {
        let kamboja = new Kamboja(engine, {
            controllerPaths: ["test/kamboja/controller"],
        })
        kamboja.init()
        let result = initSpy.getCall(0).args
        Chai.expect(result.length).eq(2)
    })

    it("Should throw if provided model directory not exists", () => {
        let kamboja = new Kamboja(engine, {
            controllerPaths: ["test/kamboja/controller"],
            modelPath: "not/a/valid/path"
        })
        Chai.expect(() => {
            kamboja.init()
        }).throw("Fatal error")
    })

    it("Should throw if controller path not found", () => {
        let kamboja = new Kamboja(engine, {
            controllerPaths: ["path/of/nowhere"]
        })
        Chai.expect(() => kamboja.init()).throw()
    })

    it("Should throw if no controller found", () => {
        let kamboja = new Kamboja(engine, {
            controllerPaths: ["test/kamboja/folder-without-controllers"],
            modelPath: "test/kamboja/model"
        })
        Chai.expect(() => kamboja.init()).throw()
    })

    it("Should throw if analysis failure", () => {
        let kamboja = new Kamboja(engine, {
            controllerPaths: ["test/kamboja/controller-with-errors"],
            modelPath: "test/kamboja/model"
        })
        Chai.expect(() => kamboja.init()).throw()
    })

    it("Should throw if valid controller found", () => {
        let kamboja = new Kamboja(engine, {
            controllerPaths: ["test/kamboja/controller-not-exported"],
            modelPath: "test/kamboja/model"
        })
        Chai.expect(() => kamboja.init()).throw()
    })

    it("Should merge validators properly", () => {
        let kamboja = new Kamboja(engine, {
            controllerPaths: ["test/kamboja/controller"],
            modelPath: "test/kamboja/model",
            validators: [
                new FakeValidator()
            ]
        })
        kamboja.init()
        let result: KambojaOption = initSpy.getCall(0).args[1]
    })

    it("Should able to hide log detail", () => {
        let kamboja = new Kamboja(engine, {
            controllerPaths: ["test/kamboja/controller"],
            modelPath: "test/kamboja/model",
            showConsoleLog: false
        })
        kamboja.init()
        let result: KambojaOption = initSpy.getCall(0).args[1]
    })

    it("Should provide options from outside", () => {
        let kamboja = new Kamboja(engine, {
            controllerPaths: ["test/kamboja/controller"],
            modelPath: "test/kamboja/model",
        })
        kamboja.init()
        let options = Kamboja.getOptions();
        let storage = options.metaDataStorage;
        Chai.expect(storage).not.null;
    })

})