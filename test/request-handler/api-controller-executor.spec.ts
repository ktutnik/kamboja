import { ApiControllerExecutor } from "../../src/request-handler/api-controller-executor"
import { ControllerExecutor } from "../../src/request-handler/controller-executor"
import { DefaultDependencyResolver, DefaultIdentifierResolver } from "../../src/resolver"
import { JsonActionResult, ViewActionResult, RedirectActionResult, FileActionResult } from "../../src/controller"
import { InMemoryMetaDataStorage } from "../../src/metadata-storage"
import { RequiredValidator, Validator } from "../../src/validator"
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

describe("ApiControllerExecutor", () => {
    let getParamStub: Sinon.SinonStub;
    let metadataStorage: InMemoryMetaDataStorage
    let resolver: Core.DependencyResolver;

    beforeEach(() => {
        getParamStub = Sinon.stub(HttpRequest, "getParam")
        resolver = new DefaultDependencyResolver(new DefaultIdentifierResolver())
        metadataStorage = new InMemoryMetaDataStorage(new DefaultIdentifierResolver())
    })

    afterEach(() => {
        getParamStub.restore();
    })

    it("Should return value properly", async () => {
        let meta = H.fromFile("test/request-handler/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.qualifiedClassName
        getParamStub.withArgs("par1").returns("param1")
        let executor = new ApiControllerExecutor(new Validator(metadataStorage, []), resolver, info, HttpRequest)
        let result = <JsonActionResult>await executor.execute()
        Chai.expect(result.body).eq("param1")
    })

    it("Should able to return value with Promise", async () => {
        let meta = H.fromFile("test/request-handler/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnTheParamWithPromise")[0]
        info.classId = info.qualifiedClassName
        getParamStub.withArgs("par1").returns("param1")
        let executor = new ApiControllerExecutor(new Validator(metadataStorage, []), resolver, info, HttpRequest)
        let result = <JsonActionResult>await executor.execute()
        Chai.expect(result.body).eq("param1")
    })

    it("Should able to use VOID method", async () => {
        let meta = H.fromFile("test/request-handler/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "voidMethod")[0]
        info.classId = info.qualifiedClassName
        let executor = new ApiControllerExecutor(new Validator(metadataStorage, []), resolver, info, HttpRequest)
        let result = <JsonActionResult>await executor.execute()
        Chai.expect(result.body).undefined
    })

})
