import { ApiControllerExecutor } from "../../src/request-handler/api-controller-executor"
import { ControllerExecutor } from "../../src/request-handler/controller-executor"
import { DefaultDependencyResolver, DefaultIdentifierResolver } from "../../src/resolver"
import { JsonActionResult, ViewActionResult, RedirectActionResult, FileActionResult } from "../../src/controller"
import { RequiredValidator, Validator } from "../../src/validator"
import { MetaDataStorage } from "../../src/metadata-storage"
import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as H from "../helper"
import * as Sinon from "sinon"
import * as Core from "../../src/core"


let HttpResponse: any = {
    json: function () { },
    end: function () { },
};

let HttpRequest: any = {
    body: {},
    getParam: (key: string) => { }
}

describe("ControllerExecutor", () => {
    let getParamStub: Sinon.SinonStub;
    let metadataStorage:MetaDataStorage
    let resolver:Core.DependencyResolver;
    
    beforeEach(() => {
        resolver = new DefaultDependencyResolver(new DefaultIdentifierResolver())
        metadataStorage = new MetaDataStorage(new DefaultIdentifierResolver())
        getParamStub = Sinon.stub(HttpRequest, "getParam")
    })

    afterEach(() => {
        getParamStub.restore();
    })

    it("Should return View properly", async () => {
        let meta = H.fromFile("test/request-handler/controller/controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnView")[0]
        info.classId = info.qualifiedClassName
        let executor = new ControllerExecutor(new Validator(metadataStorage, []), resolver, info, HttpRequest)
        let result = <ViewActionResult>await executor.execute()
        Chai.expect(result.viewName).eq("index")
    })

    it("Should return File properly", async () => {
        let meta = H.fromFile("test/request-handler/controller/controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnFile")[0]
        info.classId = info.qualifiedClassName
        let executor = new ControllerExecutor(new Validator(metadataStorage, []), resolver, info, HttpRequest)
        let result = <FileActionResult>await executor.execute()
        Chai.expect(result.filePath).eq("/go/go/kamboja.js")
    })

    it("Should return Redirect properly", async () => {
        let meta = H.fromFile("test/request-handler/controller/controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnRedirect")[0]
        info.classId = info.qualifiedClassName
        let executor = new ControllerExecutor(new Validator(metadataStorage, []), resolver, info, HttpRequest)
        let result = <RedirectActionResult>await executor.execute()
        Chai.expect(result.redirectUrl).eq("/go/go/kamboja.js")
    })

    it("Should set cookie properly", async () => {
        let meta = H.fromFile("test/request-handler/controller/controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "setTheCookie")[0]
        info.classId = info.qualifiedClassName
        let executor = new ControllerExecutor(new Validator(metadataStorage, []), resolver, info, HttpRequest)
        let result = <ViewActionResult>await executor.execute()
        Chai.expect(result.cookies[0]).deep.eq({ key: "TheKey", value: "TheValue", options: { expires: true } })
    })

})