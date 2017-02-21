import { RequestHandler } from "../../src/request-handler/request-handler"
import { DefaultDependencyResolver, DefaultIdentifierResolver } from "../../src/resolver"
import { RequiredValidator } from "../../src/validator"
import { MetaDataLoader } from "../../src/metadata-loader/metadata-loader"
import * as Transformer from "../../src/route-generator/transformers"
import {CustomValidation} from "./validator/custom-validator"
import * as Chai from "chai"
import * as H from "../helper"
import * as Sinon from "sinon"
import * as Core from "../../src/core"

let HttpResponse: any = {
    view: function () { },
    file: function () { },
    redirect: function () { },
    json: function () { },
    error: function () { },
    setCookie: function () { }
};

let HttpRequest: any = {
    body: {},
    getParam: (key: string) => { }
}

describe("RequestHandler", () => {
    let getParamStub: Sinon.SinonStub;
    let jsonSpy: Sinon.SinonSpy
    let errorSpy: Sinon.SinonSpy;
    let fileSpy: Sinon.SinonSpy;
    let setCookieSpy: Sinon.SinonSpy;
    let metadataStorage: MetaDataLoader
    let resolver: Core.DependencyResolver;

    beforeEach(() => {
        resolver = new DefaultDependencyResolver(new DefaultIdentifierResolver())
        metadataStorage = new MetaDataLoader(new DefaultIdentifierResolver())
        getParamStub = Sinon.stub(HttpRequest, "getParam")
        jsonSpy = Sinon.stub(HttpResponse, "json")
        errorSpy = Sinon.spy(HttpResponse, "error")
        fileSpy = Sinon.spy(HttpResponse, "file")
        setCookieSpy = Sinon.spy(HttpResponse, "setCookie")
    })

    afterEach(() => {
        getParamStub.restore();
        jsonSpy.restore();
        errorSpy.restore();
        fileSpy.restore()
        setCookieSpy.restore()
    })

    it("Should execute API controller properly", async () => {
        let meta = H.fromFile("test/request-handler/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        getParamStub.withArgs("par1").returns("param1")
        let executor = new RequestHandler(metadataStorage, resolver, [], info, HttpRequest, HttpResponse)
        await executor.execute()
        let result = jsonSpy.getCall(0).args[0]
        Chai.expect(result).eq("param1")
    })

    it("Should not error when provided null validator commands", async () => {
        let meta = H.fromFile("test/request-handler/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        getParamStub.withArgs("par1").returns("param1")
        let executor = new RequestHandler(metadataStorage, resolver, null, info, HttpRequest, HttpResponse)
        await executor.execute()
        let result = jsonSpy.getCall(0).args[0]
        Chai.expect(result).eq("param1")
    })

    it("Should allow classId for validators", async () => {
        let meta = H.fromFile("test/request-handler/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        getParamStub.withArgs("par1").returns("param1")
        let executor = new RequestHandler(metadataStorage, resolver, ["CustomValidation, test/request-handler/validator/custom-validator"], info, HttpRequest, HttpResponse)
        await executor.execute()
        let result = jsonSpy.getCall(0).args[0]
        Chai.expect(result).eq("param1")
    })

    it("Should allow validator instance for validators", async () => {
        let meta = H.fromFile("test/request-handler/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        getParamStub.withArgs("par1").returns("param1")
        let executor = new RequestHandler(metadataStorage, resolver, [new CustomValidation()], info, HttpRequest, HttpResponse)
        await executor.execute()
        let result = jsonSpy.getCall(0).args[0]
        Chai.expect(result).eq("param1")
    })

    it("Should set cookie to the response properly", async () => {
        let meta = H.fromFile("test/request-handler/controller/controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "setTheCookie")[0]
        info.classId = info.qualifiedClassName
        let executor = new RequestHandler(metadataStorage, resolver, [], info, HttpRequest, HttpResponse)
        await executor.execute()
        let result = setCookieSpy.getCall(0).args
        Chai.expect(result).deep.eq(['TheKey', 'TheValue', { expires: true }])
    })

    it("Should handle internal error inside controller properly", async () => {
        let meta = H.fromFile("test/request-handler/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "internalError")[0]
        info.classId = info.qualifiedClassName
        let executor = new RequestHandler(metadataStorage, resolver, [], info, HttpRequest, HttpResponse)
        await executor.execute()
        let result = errorSpy.getCall(0).args[0]
        Chai.expect(result.message).contains("Internal error from DummyApi")
    })

    it("Should handle controller execution properly", async () => {
        let meta = H.fromFile("test/request-handler/controller/controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnFile")[0]
        info.classId = info.qualifiedClassName
        let executor = new RequestHandler(metadataStorage, resolver, [], info, HttpRequest, HttpResponse)
        await executor.execute()
        let result = fileSpy.getCall(0).args[0]
        Chai.expect(result).eq("/go/go/kamboja.js")
    })

    it("Should handle error properly on controller when return non ActionResult", async () => {
        let meta = H.fromFile("test/request-handler/controller/controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnNonActionResult")[0]
        info.classId = info.qualifiedClassName
        let executor = new RequestHandler(metadataStorage, resolver, [], info, HttpRequest, HttpResponse)
        await executor.execute()
        let result = errorSpy.getCall(0).args[0]
        Chai.expect(result.message).contains("Controller must return ActionResult")
    })

    it("Should handle validation properly", async () => {
        let meta = H.fromFile("test/request-handler/controller/controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "validationTest")[0]
        info.classId = info.qualifiedClassName
        getParamStub.withArgs("age").returns(undefined)
        let executor = new RequestHandler(metadataStorage, resolver, [], info, HttpRequest, HttpResponse)
        await executor.execute()
        let result = jsonSpy.getCall(0).args[0]
        Chai.expect(result[0].field).eq("age")
        Chai.expect(result[0].message).contain("required")
    })
})