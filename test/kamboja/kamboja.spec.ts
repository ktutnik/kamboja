import * as Chai from "chai"
import { Kamboja, Validator, Core, Resolver, MetaDataLoader } from "../../src"
import * as Sinon from "sinon"
import * as Kecubung from "kecubung"

let engine = {
    init: () => { }
}

class FakeValidator extends Validator.ValidatorBase {
    validate(arg: Core.FieldValidatorArg): Core.ValidationError[] {
        return;
    }
}

class FakeInterceptor implements Core.RequestInterceptor {
    constructor(private opt: Core.KambojaOption) { }
    async intercept(invocation: Core.Invocation) {
        return invocation.execute()
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
        let result: Core.KambojaOption = initSpy.getCall(0).args[1]
    })

    it("Should able to hide log detail", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            showConsoleLog: false
        })
        kamboja.init()
        let result: Core.KambojaOption = initSpy.getCall(0).args[1]
    })

    it("Should able to add interception from outside option", () => {
        let opt: Core.KambojaOption = {
            rootPath: __dirname,
            showConsoleLog: false
        }
        let kamboja = new Kamboja(engine, opt)
        kamboja.intercept(x => new FakeInterceptor(x))
        kamboja.intercept(x => [new FakeInterceptor(x), new FakeInterceptor(x)])
        Chai.expect((<any>kamboja).options.interceptors.length).eq(3)
    })

    it("Should able to mix interception from option and method", () => {
        let opt: Core.KambojaOption = {
            rootPath: __dirname,
            showConsoleLog: false,
            interceptors:[
                new FakeInterceptor(null)
            ]
        }
        let kamboja = new Kamboja(engine, opt)
        kamboja.intercept(x => new FakeInterceptor(x))
        kamboja.intercept(x => [new FakeInterceptor(x), new FakeInterceptor(x)])
        Chai.expect((<any>kamboja).options.interceptors.length).eq(4)
    })

})