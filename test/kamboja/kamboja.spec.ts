import * as Chai from "chai"
import { Kamboja, Validator, Core, Resolver, MetaDataLoader } from "../../src"
import * as Sinon from "sinon"
import * as Kecubung from "kecubung"
import * as H from "../helper"

let engine = {
    init: () => { }
}

class FakeValidator extends Validator.ValidatorBase {
    validate(arg: Core.FieldValidatorArg): Core.ValidationError[] {
        return;
    }
}

class FakeInterceptor implements Core.Middleware {
    constructor() { }
    async execute(request:Core.HttpRequest, invocation: Core.Invocation) {
        return invocation.proceed()
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

    it("Should generate routes properly", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname
        })
        kamboja.init()
        let result = initSpy.getCall(0).args[0]
        let clean = H.cleanUp(result)
        Chai.expect(clean).deep.eq([{
            initiator: 'ApiConvention',
            route: '/categories/:id',
            httpMethod: 'GET',
            methodMetaData: { name: 'get' },
            qualifiedClassName: 'CategoriesController, controller/api-controller',
            classMetaData: { name: 'CategoriesController', baseClass: 'ApiController' },
            collaborator: ['Controller']
        },
        {
            initiator: 'ApiConvention',
            route: '/categories',
            httpMethod: 'GET',
            methodMetaData: { name: 'list' },
            qualifiedClassName: 'CategoriesController, controller/api-controller',
            classMetaData: { name: 'CategoriesController', baseClass: 'ApiController' },
            collaborator: ['Controller']
        },
        {
            initiator: 'ApiConvention',
            route: '/categories',
            httpMethod: 'POST',
            methodMetaData: { name: 'add' },
            qualifiedClassName: 'CategoriesController, controller/api-controller',
            classMetaData: { name: 'CategoriesController', baseClass: 'ApiController' },
            collaborator: ['Controller']
        },
        {
            initiator: 'ApiConvention',
            route: '/categories/:id',
            httpMethod: 'PUT',
            methodMetaData: { name: 'replace' },
            qualifiedClassName: 'CategoriesController, controller/api-controller',
            classMetaData: { name: 'CategoriesController', baseClass: 'ApiController' },
            collaborator: ['Controller']
        },
        {
            initiator: 'ApiConvention',
            route: '/categories/:id',
            httpMethod: 'PATCH',
            methodMetaData: { name: 'modify' },
            qualifiedClassName: 'CategoriesController, controller/api-controller',
            classMetaData: { name: 'CategoriesController', baseClass: 'ApiController' },
            collaborator: ['Controller']
        },
        {
            initiator: 'ApiConvention',
            route: '/categories/:id',
            httpMethod: 'DELETE',
            methodMetaData: { name: 'delete' },
            qualifiedClassName: 'CategoriesController, controller/api-controller',
            classMetaData: { name: 'CategoriesController', baseClass: 'ApiController' },
            collaborator: ['Controller']
        },
        {
            initiator: 'ApiConvention',
            route: '/categories/:categoryId/items/:id',
            httpMethod: 'GET',
            methodMetaData: { name: 'get' },
            qualifiedClassName: 'CategoriesItemController, controller/api-controller',
            classMetaData: { name: 'CategoriesItemController', baseClass: 'ApiController' },
            collaborator: ['ControllerWithDecorator']
        },
        {
            initiator: 'ApiConvention',
            route: '/categories/:categoryId/items',
            httpMethod: 'GET',
            methodMetaData: { name: 'list' },
            qualifiedClassName: 'CategoriesItemController, controller/api-controller',
            classMetaData: { name: 'CategoriesItemController', baseClass: 'ApiController' },
            collaborator: ['ControllerWithDecorator']
        },
        {
            initiator: 'ApiConvention',
            route: '/categories/:categoryId/items',
            httpMethod: 'POST',
            methodMetaData: { name: 'add' },
            qualifiedClassName: 'CategoriesItemController, controller/api-controller',
            classMetaData: { name: 'CategoriesItemController', baseClass: 'ApiController' },
            collaborator: ['ControllerWithDecorator']
        },
        {
            initiator: 'ApiConvention',
            route: '/categories/:categoryId/items/:id',
            httpMethod: 'PUT',
            methodMetaData: { name: 'replace' },
            qualifiedClassName: 'CategoriesItemController, controller/api-controller',
            classMetaData: { name: 'CategoriesItemController', baseClass: 'ApiController' },
            collaborator: ['ControllerWithDecorator']
        },
        {
            initiator: 'ApiConvention',
            route: '/categories/:categoryId/items/:id',
            httpMethod: 'PATCH',
            methodMetaData: { name: 'modify' },
            qualifiedClassName: 'CategoriesItemController, controller/api-controller',
            classMetaData: { name: 'CategoriesItemController', baseClass: 'ApiController' },
            collaborator: ['ControllerWithDecorator']
        },
        {
            initiator: 'ApiConvention',
            route: '/categories/:categoryId/items/:id',
            httpMethod: 'DELETE',
            methodMetaData: { name: 'delete' },
            qualifiedClassName: 'CategoriesItemController, controller/api-controller',
            classMetaData: { name: 'CategoriesItemController', baseClass: 'ApiController' },
            collaborator: ['ControllerWithDecorator']
        },
        {
            initiator: 'DefaultAction',
            route: '/user/getbypage',
            httpMethod: 'GET',
            methodMetaData: { name: 'getByPage' },
            qualifiedClassName: 'UserController, controller/user-controller',
            classMetaData: { name: 'UserController', baseClass: 'ApiController' },
            collaborator: ['Controller']
        }])
    })

    it("Should provide default option properly", () => {
        let kamboja: any = new Kamboja(engine, {
            rootPath: __dirname
        })

        let option: Core.KambojaOption = kamboja.options;

        Chai.expect(option.autoValidation).true
        Chai.expect(option.controllerPaths).deep.eq(["controller"])
        Chai.expect(option.modelPath).eq("model")
        Chai.expect(option.rootPath).eq(__dirname)
        Chai.expect(option.skipAnalysis).false
    })

    it("Should able to only provide __dirname on the constructor", () => {
        let kamboja: any = new Kamboja(engine, __dirname)

        let option: Core.KambojaOption = kamboja.options;

        Chai.expect(option.autoValidation).true
        Chai.expect(option.controllerPaths).deep.eq(["controller"])
        Chai.expect(option.modelPath).eq("model")
        Chai.expect(option.rootPath).eq(__dirname)
        Chai.expect(option.skipAnalysis).false
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

    it("Should able to add middleware from outside option", () => {
        let opt: Core.KambojaOption = {
            rootPath: __dirname,
        }
        let kamboja = new Kamboja(engine, opt)
        kamboja.use(new FakeInterceptor())
            .use([new FakeInterceptor(), new FakeInterceptor()])
            .init()
        Chai.expect((<any>kamboja).options.middlewares.length).eq(3)
    })

    it("Should able to mix middleware from option and method", () => {
        let opt: Core.KambojaOption = {
            rootPath: __dirname,
            middlewares: [
                new FakeInterceptor()
            ]
        }
        let kamboja = new Kamboja(engine, opt)
        kamboja.use(new FakeInterceptor())
            .use([new FakeInterceptor(), new FakeInterceptor()])
            .init()
        Chai.expect((<any>kamboja).options.middlewares.length).eq(4)
    })

    it("Should provide facade properly before init", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname
        })
        let metadata = Kamboja.getFacade();
        Chai.expect(metadata).not.null
    })


})