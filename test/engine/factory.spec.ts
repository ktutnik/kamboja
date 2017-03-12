import { ControllerFactory } from "../../src/engine/factory"
import { DefaultDependencyResolver, DefaultIdentifierResolver } from "../../src/resolver"
import { MetaDataLoader } from "../../src/metadata-loader/metadata-loader"
import { DummyApi, ChangeValueToHelloWorld } from "./controller/controller-intercepted"
import { UnQualifiedNameOnClassController } from "./controller/controller-intercepted-invalid-class"
import { UnQualifiedNameOnMethodController } from "./controller/controller-intercepted-invalid-method"
import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as H from "../helper"
import * as Core from "../../src/core"
import { getId } from "./interceptor/interceptor-identifier"
import { CustomValidation } from "./validator/custom-validator"

describe("Factory", () => {
    let facade: Core.Facade;

    beforeEach(() => {
        facade = {
            identifierResolver: new DefaultIdentifierResolver(),
            dependencyResolver: new DefaultDependencyResolver(new DefaultIdentifierResolver()),
            metaDataStorage: new MetaDataLoader(new DefaultIdentifierResolver()),
        }
    })

    it("Should provide controller properly", () => {
        let meta = H.fromFile("test/engine/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        let container = new ControllerFactory(facade, info)
        Chai.expect(container.createController()).not.null
    })

    it("Should throw if provided invalid classId", () => {
        let meta = H.fromFile("test/engine/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = "InvalidClass, invalid/path"
        let container = new ControllerFactory(facade, info)
        Chai.expect(() => {
            container.createController()
        }).throw("Can not instantiate [InvalidClass, invalid/path] as Controller")
    })

    it("Should provide custom validator properly", () => {
        let meta = H.fromFile("test/engine/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        facade.validators = []
        facade.validators.push(new CustomValidation())
        let container = new ControllerFactory(facade, info)
        Chai.expect(container.validatorCommands.length).eq(1)
    })

    it("Should provide custom validator using qualified class name", () => {
        let meta = H.fromFile("test/engine/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        facade.validators = []
        facade.validators.push("CustomValidation, test/engine/validator/custom-validator")
        let container = new ControllerFactory(facade, info)
        Chai.expect(container.validatorCommands.length).eq(1)
    })

    it("Should throw if provided invalid validator qualified class name", () => {
        let meta = H.fromFile("test/engine/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        facade.validators = []
        facade.validators.push("Invalid, test/invalid/path")
        Chai.expect(() => new ControllerFactory(facade, info)).throw("Can not instantiate custom validator [Invalid, test/invalid/path]")
    })

    it("Should provide interceptors properly", () => {
        let meta = H.fromFile("test/engine/controller/controller-intercepted.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        facade.interceptors = [];
        facade.interceptors.push("DefaultInterceptor, test/engine/interceptor/default-interceptor")
        facade.interceptors.push(new ChangeValueToHelloWorld())
        let factory = new ControllerFactory(facade, info)
        let result = factory.createInterceptors()
        Chai.expect(result.length).eq(6)
    })

    it("Should throw if provided unqualified class name in global interceptor", () => {
        let meta = H.fromFile("test/engine/controller/controller-intercepted.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        facade.interceptors = [];
        facade.interceptors.push("UnqualifiedName, path/of/nowhere")
        let factory = new ControllerFactory(facade, info);
        Chai.expect(() => factory.createInterceptors()).throw("Can not instantiate interceptor [UnqualifiedName, path/of/nowhere] in global interceptors")
    })

    it("Should throw if provided unqualified class name interceptor in class scope", () => {
        let meta = H.fromFile("test/engine/controller/controller-intercepted-invalid-class.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "UnQualifiedNameOnClassController")[0]
        info.classId = info.qualifiedClassName
        let factory = new ControllerFactory(facade, info)
        Chai.expect(() => factory.createInterceptors()).throw("Can not instantiate interceptor [UnqualifiedName, path/of/nowhere] on [UnQualifiedNameOnClassController, test/engine/controller/controller-intercepted-invalid-class.js]")
    })

    it("Should throw if provided unqualified class name in method scope", () => {
        let meta = H.fromFile("test/engine/controller/controller-intercepted-invalid-method.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "UnQualifiedNameOnMethodController")[0]
        info.classId = info.qualifiedClassName
        let factory = new ControllerFactory(facade, info)
        Chai.expect(() => factory.createInterceptors()).throw("Can not instantiate interceptor [UnqualifiedName, path/of/nowhere] on [UnQualifiedNameOnMethodController.returnView test/engine/controller/controller-intercepted-invalid-method.js]")
    })

    it("Should return in reverse order in global interceptors", () => {
        let meta = H.fromFile("test/engine/controller/controller-intercepted.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        facade.interceptors = [];
        facade.interceptors.push("DefaultInterceptor, test/engine/interceptor/default-interceptor")
        facade.interceptors.push(new ChangeValueToHelloWorld())
        let executor: any = new ControllerFactory(facade, info)
        let result = executor.getGlobalInterceptors();
        Chai.expect(getId(result[0])).eq("ChangeValueToHelloWorld")
        Chai.expect(getId(result[1])).eq("DefaultInterceptor")
    })

    it("Should return in reverse order in class scope interceptors", () => {
        let meta = H.fromFile("test/engine/controller/controller-intercepted.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        let executor: any = new ControllerFactory(facade, info)
        let result = executor.getClassInterceptors(executor.createController());
        Chai.expect(getId(result[0])).eq("ChangeValueToHelloWorld")
        Chai.expect(getId(result[1])).eq("DefaultInterceptor")
    })

    it("Should return in reverse order in method scope interceptors", () => {
        let meta = H.fromFile("test/engine/controller/controller-intercepted.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        let executor: any = new ControllerFactory(facade, info)
        let result = executor.getMethodInterceptors(executor.createController());
        Chai.expect(getId(result[0])).eq("ChangeValueToHelloWorld")
        Chai.expect(getId(result[1])).eq("DefaultInterceptor")
    })
})