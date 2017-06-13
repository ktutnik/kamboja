import * as Chai from "chai"
import { Kamboja, Validator, Core, Resolver, MetaDataLoader } from "../../src"
import * as Sinon from "sinon"
import * as Kecubung from "kecubung"
import * as H from "../helper"
import { BasicFacility } from "./facility/basic-facility"

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
    async execute(request: Core.HttpRequest, invocation: Core.Invocation) {
        return invocation.proceed()
    }
}

class MyIdResolver implements Core.IdentifierResolver {
    getClassId(qualifiedClassName: string) {
        return qualifiedClassName;
    }
    getClassName(classId: string) {
        return classId;
    }
}

class MyDependencyResolver implements Core.DependencyResolver {
    resolve<T>(qualifiedClassName: string) {
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
            rootPath: __dirname,
            showLog: "None"
        })
        kamboja.init()
        let result = initSpy.getCall(0).args
        Chai.expect(result.length).eq(2)
    })

    it("Should generate routes properly", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            showLog: "None"
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
            rootPath: __dirname,
            showLog: "None"
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
            rootPath: __dirname,
            showLog: "None"
        })
        kamboja.init()
        let result = initSpy.getCall(0).args
        Chai.expect(result.length).eq(2)
    })

    it("Should throw if provided model directory not exists", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            modelPath: "not/a/valid/path",
            showLog: "None"
        })
        Chai.expect(() => {
            kamboja.init()
        }).throw("Fatal error")
    })

    it("Should throw if controller path not found", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            controllerPaths: ["path/of/nowhere"],
            showLog: "None"
        })
        Chai.expect(() => kamboja.init()).throw()
    })

    it("Should throw if no controller found", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            controllerPaths: ["folder-without-controllers"],
            showLog: "None"
        })
        Chai.expect(() => kamboja.init()).throw()
    })

    it("Should throw if analysis failure", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            controllerPaths: ["controller-with-errors"],
            showLog: "None"
        })
        Chai.expect(() => kamboja.init()).throw()
    })

    it("Should throw if valid controller found", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            controllerPaths: ["controller-not-exported"],
            showLog: "None"
        })
        Chai.expect(() => kamboja.init()).throw()
    })

    it("Should merge validators properly", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            validators: [
                new FakeValidator()
            ],
            showLog: "None"
        })
        kamboja.init()
        let result: Core.KambojaOption = initSpy.getCall(0).args[1]
    })

    it("Should able to add middleware from outside option", () => {
        let opt: Core.KambojaOption = {
            rootPath: __dirname,
            showLog: "None",
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
            ],
            showLog: "None"
        }
        let kamboja = new Kamboja(engine, opt)
        kamboja.use(new FakeInterceptor())
            .use([new FakeInterceptor(), new FakeInterceptor()])
            .init()
        Chai.expect((<any>kamboja).options.middlewares.length).eq(4)
    })

    it("Should provide facade properly before init", () => {
        let kamboja = new Kamboja(engine, {
            rootPath: __dirname,
            showLog: "None"
        })
        let metadata = Kamboja.getFacade();
        Chai.expect(metadata).not.null
    })

    it("Should able to use custom identifier resolver", () => {
        let opt: Core.KambojaOption = {
            rootPath: __dirname,
            showLog: "None",
            identifierResolver: new MyIdResolver()
        }
        let kamboja = new Kamboja(engine, opt)
        let idResolver = Kamboja.getFacade().identifierResolver;
        Chai.expect(idResolver instanceof MyIdResolver).true
    })

    it("Should able to use custom dependency resolver", () => {
        let opt: Core.KambojaOption = {
            rootPath: __dirname,
            showLog: "None",
            dependencyResolver: new MyDependencyResolver()
        }
        let kamboja = new Kamboja(engine, opt)
        let dependencyResolver = Kamboja.getFacade().dependencyResolver;
        Chai.expect(dependencyResolver instanceof MyDependencyResolver).true
    })

    it("Should be able to set and get configuration", () => {
        let opt: Core.KambojaOption = {
            rootPath: __dirname,
            showLog: "None",
            dependencyResolver: new MyDependencyResolver()
        }
        let kamboja = new Kamboja(engine, opt)
        Chai.expect(kamboja.get("showLog")).eq("None")
        kamboja.set("skipAnalysis", true)
        Chai.expect(kamboja.get("skipAnalysis")).true;
    })

    it("Should be able to set facility using instance", () => {
        let kamboja = new Kamboja(engine, __dirname);
        kamboja.apply(new BasicFacility());
        Chai.expect(kamboja.get("showLog")).eq("None")
        Chai.expect(kamboja.get("skipAnalysis")).true;
        Chai.expect(kamboja.get("facilities").length).eq(1)
    })

    it("Should be able to set facility using qualified name", () => {
        let kamboja = new Kamboja(engine, __dirname);
        kamboja.apply("BasicFacility, facility/basic-facility");
        Chai.expect(kamboja.get("showLog")).eq("None")
        Chai.expect(kamboja.get("skipAnalysis")).true;
        Chai.expect(kamboja.get("facilities").length).eq(1)
    })

    it("Should throw exception if provide invalid facility qualified name", () => {
        let kamboja = new Kamboja(engine, __dirname);
        Chai.expect(() => {
            kamboja.apply("AdvancedFacility, facility/basic-facility");
        }).throw("Unable to instantiate AdvancedFacility, facility/basic-facility as Facility")
    })

})