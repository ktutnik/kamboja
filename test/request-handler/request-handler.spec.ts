import { RequestHandler } from "../../src/request-handler/request-handler"
import { DefaultDependencyResolver } from "../../src/resolver"
import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as H from "../helper"
import * as Sinon from "sinon"


let HttpResponse: any = {
    view: function () { },
    file: function () { },
    redirect: function () { },
    json: function () { },
    error: function () { }
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

    beforeEach(() => {
        getParamStub = Sinon.stub(HttpRequest, "getParam")
        jsonSpy = Sinon.stub(HttpResponse, "json")
        errorSpy = Sinon.spy(HttpResponse, "error")
        fileSpy = Sinon.spy(HttpResponse, "file")
    })

    afterEach(() => {
        getParamStub.restore();
        jsonSpy.restore();
        errorSpy.restore();
        fileSpy.restore()
    })

    it("Should execute API controller properly", async () => {
        let meta = H.fromFile("test/request-handler/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnTheParam")[0]
        info.classId = info.className
        getParamStub.withArgs("par1").returns("param1")
        let executor = new RequestHandler(info, new DefaultDependencyResolver(), HttpRequest, HttpResponse)
        await executor.execute()
        let result = jsonSpy.getCall(0).args[0]
        Chai.expect(result).eq("param1")
    })

    it("Should handle internal error inside controller properly", async () => {
        let meta = H.fromFile("test/request-handler/controller/api-controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "internalError")[0]
        info.classId = info.className
        let executor = new RequestHandler(info, new DefaultDependencyResolver(), HttpRequest, HttpResponse)
        await executor.execute()
        let result = errorSpy.getCall(0).args[0]
        Chai.expect(result.message).contains("Internal error from DummyApi")
    })

    it("Should handle controller execution properly", async () => {
        let meta = H.fromFile("test/request-handler/controller/controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnFile")[0]
        info.classId = info.className
        let executor = new RequestHandler(info, new DefaultDependencyResolver(), HttpRequest, HttpResponse)
        await executor.execute()
        let result = fileSpy.getCall(0).args[0]
        Chai.expect(result).eq("/go/go/kamboja.js")
    })

    it("Should handle error properly on controller when return non ActionResult", async () => {
        let meta = H.fromFile("test/request-handler/controller/controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnNonActionResult")[0]
        info.classId = info.className
        let executor = new RequestHandler(info, new DefaultDependencyResolver(), HttpRequest, HttpResponse)
        await executor.execute()
        let result = errorSpy.getCall(0).args[0]
        Chai.expect(result.message).contains("Controller must return ActionResult")
    })
})