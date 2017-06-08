import { MiddlewareFactory } from "../../src/engine/middleware-factory"
import { DefaultPathResolver } from "../../src/resolver"
import { ChangeValueToHelloWorld } from "./controller/controller-intercepted"
import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as H from "../helper"
import { getId } from "./interceptor/interceptor-identifier"
import { Kamboja, Core } from "../../src"
import { DummyApi } from "./controller/controller-intercepted"
import { UnQualifiedNameOnClassController } from "./controller/controller-intercepted-invalid-class"
import { UnQualifiedNameOnMethodController } from "./controller/controller-intercepted-invalid-method"

describe("MiddlewareFactory", () => {
    let facade: Core.Facade
    beforeEach(() => {
        facade = H.createFacade(__dirname)
    })

    it("Should provide interceptors properly", () => {
        let meta = H.fromFile("controller/controller-intercepted.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        facade.middlewares = [
            "DefaultInterceptor, interceptor/default-interceptor",
            new ChangeValueToHelloWorld()
        ]
        let factory = new MiddlewareFactory(facade, new DummyApi(), info)
        let result = factory.createMiddlewares()
        Chai.expect(result.length).eq(6)
    })

    it("Should throw if provided unqualified class name in global interceptor", () => {
        let meta = H.fromFile("controller/controller-intercepted.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        facade.middlewares = [
            "UnqualifiedName, path/of/nowhere"
        ]
        let factory = new MiddlewareFactory(facade, new DummyApi(), info)
        Chai.expect(() => factory.createMiddlewares()).throw("Can not instantiate middleware [UnqualifiedName, path/of/nowhere] in global middlewares")
    })

    it("Should throw if provided unqualified class name interceptor in class scope", () => {
        let meta = H.fromFile("controller/controller-intercepted-invalid-class.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "UnQualifiedNameOnClassController")[0]
        info.classId = info.qualifiedClassName
        let factory = new MiddlewareFactory(facade, new UnQualifiedNameOnClassController(), info)
        Chai.expect(() => factory.createMiddlewares()).throw("Can not instantiate middleware [UnqualifiedName, path/of/nowhere] on [UnQualifiedNameOnClassController, controller/controller-intercepted-invalid-class.js]")
    })

    it("Should throw if provided unqualified class name in method scope", () => {
        let meta = H.fromFile("controller/controller-intercepted-invalid-method.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "UnQualifiedNameOnMethodController")[0]
        info.classId = info.qualifiedClassName
        let factory = new MiddlewareFactory(facade, new UnQualifiedNameOnMethodController(), info)
        Chai.expect(() => factory.createMiddlewares()).throw("Can not instantiate middleware [UnqualifiedName, path/of/nowhere] on [UnQualifiedNameOnMethodController.returnView controller/controller-intercepted-invalid-method.js]")
    })

    it("Should return in reverse order in global interceptors", () => {
        let meta = H.fromFile("controller/controller-intercepted.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        facade.middlewares = [
            "DefaultInterceptor, interceptor/default-interceptor",
            new ChangeValueToHelloWorld()
        ]
        let executor: any = new MiddlewareFactory(facade, new DummyApi(), info)
        let result = executor.getGlobalMiddlewares();
        Chai.expect(getId(result[0])).eq("ChangeValueToHelloWorld")
        Chai.expect(getId(result[1])).eq("DefaultInterceptor")
    })

    it("Should return in reverse order in class scope interceptors", () => {
        let meta = H.fromFile("controller/controller-intercepted.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        let executor = new MiddlewareFactory(facade, new DummyApi(), info)
        let result = executor.getClassMiddlewares(new DummyApi());
        Chai.expect(getId(result[0])).eq("ChangeValueToHelloWorld")
        Chai.expect(getId(result[1])).eq("DefaultInterceptor")
    })

    it("Should return in reverse order in method scope interceptors", () => {
        let meta = H.fromFile("controller/controller-intercepted.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        let executor = new MiddlewareFactory(facade, new DummyApi(), info)
        let result = executor.getMethodMiddlewares(new DummyApi());
        Chai.expect(getId(result[0])).eq("ChangeValueToHelloWorld")
        Chai.expect(getId(result[1])).eq("DefaultInterceptor")
    })
})
