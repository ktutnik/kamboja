import { Container } from "../../src/request-handler/container"
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

describe("Container", () => {
    let facade: Core.Facade;

    beforeEach(() => {
        facade = {
            identifierResolver: new DefaultIdentifierResolver(),
            dependencyResolver: new DefaultDependencyResolver(new DefaultIdentifierResolver()),
            metaDataStorage: new MetaDataLoader(new DefaultIdentifierResolver()),
        }
    })

    it.only("Should provide controller properly", () => {
        let meta = H.fromFile("test/request-handler/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        let container = new Container(facade, info)
        Chai.expect(container.controller).not.null
        chai.expect(container.controller.validator).not.null
    })

    it("Should provide interceptors properly", () => {
        let meta = H.fromFile("test/request-handler/controller/controller-intercepted.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        facade.interceptors = [];
        facade.interceptors.push("DefaultInterceptor, test/request-handler/interceptor/default-interceptor")
        facade.interceptors.push(new ChangeValueToHelloWorld())
        let executor = new Container(facade, info)
        let result = executor.interceptors
        Chai.expect(result.length).eq(6)
    })

    it("Should throw if provided unqualified class name in global interceptor", () => {
        let meta = H.fromFile("test/request-handler/controller/controller-intercepted.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        facade.interceptors = [];
        facade.interceptors.push("UnqualifiedName, path/of/nowhere")
        let executor = new Container(facade, info)
        Chai.expect(() => executor.interceptors).throw("Can not instantiate interceptor [UnqualifiedName, path/of/nowhere] in global interceptors")
    })

    it("Should throw if provided unqualified class name in class scope", () => {
        let meta = H.fromFile("test/request-handler/controller/controller-intercepted-invalid-class.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "UnQualifiedNameOnClassController")[0]
        info.classId = info.qualifiedClassName
        let executor = new Container(facade, info)
        Chai.expect(() => executor.interceptors).throw("Can not instantiate interceptor [UnqualifiedName, path/of/nowhere] on [UnQualifiedNameOnClassController, test/request-handler/controller/controller-intercepted-invalid-class.js]")
    })

    it("Should throw if provided unqualified class name in method scope", () => {
        let meta = H.fromFile("test/request-handler/controller/controller-intercepted-invalid-method.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "UnQualifiedNameOnMethodController")[0]
        info.classId = info.qualifiedClassName
        let executor = new Container(facade, info)
        Chai.expect(() => executor.interceptors).throw("Can not instantiate interceptor [UnqualifiedName, path/of/nowhere] on [UnQualifiedNameOnMethodController.returnView test/request-handler/controller/controller-intercepted-invalid-method.js]")
    })

    it("Should return in reverse order in global interceptors", () => {
        let meta = H.fromFile("test/request-handler/controller/controller-intercepted.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        facade.interceptors = [];
        facade.interceptors.push("DefaultInterceptor, test/request-handler/interceptor/default-interceptor")
        facade.interceptors.push(new ChangeValueToHelloWorld())
        let executor:any = new Container(facade, info)
        let result = executor.getGlobalInterceptors();
        Chai.expect(getId(result[0])).eq("ChangeValueToHelloWorld")
        Chai.expect(getId(result[1])).eq("DefaultInterceptor")
    })

    it("Should return in reverse order in class scope interceptors", () => {
         let meta = H.fromFile("test/request-handler/controller/controller-intercepted.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        let executor:any = new Container(facade, info)
        let result = executor.getClassInterceptors();
        Chai.expect(getId(result[0])).eq("ChangeValueToHelloWorld")
        Chai.expect(getId(result[1])).eq("DefaultInterceptor")
   })

    it("Should return in reverse order in method scope interceptors", () => {
        let meta = H.fromFile("test/request-handler/controller/controller-intercepted.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData && x.methodMetaData.name == "returnView" && x.classMetaData.name == "DummyApi")[0]
        info.classId = info.qualifiedClassName
        let executor:any = new Container(facade, info)
        let result = executor.getMethodInterceptors();
        Chai.expect(getId(result[0])).eq("ChangeValueToHelloWorld")
        Chai.expect(getId(result[1])).eq("DefaultInterceptor")
    })
})