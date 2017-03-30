import { ControllerFactory } from "../../src/engine/factory"
import { DefaultPathResolver } from "../../src/resolver"
import { ChangeValueToHelloWorld } from "./controller/controller-intercepted"
import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as H from "../helper"
import { getId } from "./interceptor/interceptor-identifier"
import { CustomValidation } from "./validator/custom-validator"
import { Kamboja, Core } from "../../src"

describe("Controller Factory", () => {
    let facade: Core.Facade
    beforeEach(() => {
        facade = H.createFacade(__dirname)
    })

    it("Should provide controller properly", () => {
        let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        let container = new ControllerFactory(facade, info)
        Chai.expect(container.createController()).not.null
    })

    it("Should throw if provided invalid classId", () => {
        let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = "InvalidClass, invalid/path"
        let container = new ControllerFactory(facade, info)
        Chai.expect(() => {
            container.createController()
        }).throw("Can not instantiate [InvalidClass, invalid/path] as Controller")
    })

    it("Should provide custom validator properly", () => {
        let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        facade.validators = [new CustomValidation()]
        let container = new ControllerFactory(facade, info)
        Chai.expect(container.validatorCommands.length).eq(1)
    })

    it("Should provide custom validator using qualified class name", () => {
        let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        facade.validators = ["CustomValidation, validator/custom-validator"]
        let container = new ControllerFactory(facade, info)
        Chai.expect(container.validatorCommands.length).eq(1)
    })

    it("Should throw if provided invalid validator qualified class name", () => {
        let meta = H.fromFile("controller/api-controller.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        facade.validators = ["Invalid, test/invalid/path"]
        Chai.expect(() => new ControllerFactory(facade, info)).throw("Can not instantiate custom validator [Invalid, test/invalid/path]")
    })

    it("Should provide interceptors properly", () => {
        let meta = H.fromFile("controller/controller-intercepted.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        facade.interceptors = [
            "DefaultInterceptor, interceptor/default-interceptor",
            new ChangeValueToHelloWorld()
        ]
        let factory = new ControllerFactory(facade, info)
        let result = factory.createInterceptors()
        Chai.expect(result.length).eq(6)
    })

    it("Should throw if provided unqualified class name in global interceptor", () => {
        let meta = H.fromFile("controller/controller-intercepted.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        facade.interceptors = [
            "UnqualifiedName, path/of/nowhere"
        ]
        let factory = new ControllerFactory(facade, info);
        Chai.expect(() => factory.createInterceptors()).throw("Can not instantiate interceptor [UnqualifiedName, path/of/nowhere] in global interceptors")
    })

    it("Should throw if provided unqualified class name interceptor in class scope", () => {
        let meta = H.fromFile("controller/controller-intercepted-invalid-class.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "UnQualifiedNameOnClassController")[0]
        info.classId = info.qualifiedClassName
        let factory = new ControllerFactory(facade, info)
        Chai.expect(() => factory.createInterceptors()).throw("Can not instantiate interceptor [UnqualifiedName, path/of/nowhere] on [UnQualifiedNameOnClassController, controller/controller-intercepted-invalid-class.js]")
    })

    it("Should throw if provided unqualified class name in method scope", () => {
        let meta = H.fromFile("controller/controller-intercepted-invalid-method.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "UnQualifiedNameOnMethodController")[0]
        info.classId = info.qualifiedClassName
        let factory = new ControllerFactory(facade, info)
        Chai.expect(() => factory.createInterceptors()).throw("Can not instantiate interceptor [UnqualifiedName, path/of/nowhere] on [UnQualifiedNameOnMethodController.returnView controller/controller-intercepted-invalid-method.js]")
    })

    it("Should return in reverse order in global interceptors", () => {
        let meta = H.fromFile("controller/controller-intercepted.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        facade.interceptors = [
            "DefaultInterceptor, interceptor/default-interceptor",
            new ChangeValueToHelloWorld()
        ]
        let executor: any = new ControllerFactory(facade, info)
        let result = executor.getGlobalInterceptors();
        Chai.expect(getId(result[0])).eq("ChangeValueToHelloWorld")
        Chai.expect(getId(result[1])).eq("DefaultInterceptor")
    })

    it("Should return in reverse order in class scope interceptors", () => {
        let meta = H.fromFile("controller/controller-intercepted.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        let executor: any = new ControllerFactory(facade, info)
        let result = executor.getClassInterceptors(executor.createController());
        Chai.expect(getId(result[0])).eq("ChangeValueToHelloWorld")
        Chai.expect(getId(result[1])).eq("DefaultInterceptor")
    })

    it("Should return in reverse order in method scope interceptors", () => {
        let meta = H.fromFile("controller/controller-intercepted.js", new DefaultPathResolver(__dirname))
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        let executor: any = new ControllerFactory(facade, info)
        let result = executor.getMethodInterceptors(executor.createController());
        Chai.expect(getId(result[0])).eq("ChangeValueToHelloWorld")
        Chai.expect(getId(result[1])).eq("DefaultInterceptor")
    })
})