import { ApiControllerExecutor } from "../../src/request-handler/api-controller-executor"
import { ControllerExecutor } from "../../src/request-handler/controller-executor"
import { DefaultDependencyResolver } from "../../src/resolver"
import { JsonActionResult, ViewActionResult, RedirectActionResult, FileActionResult } from "../../src/controller"
import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as H from "../helper"
import * as Sinon from "sinon"


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

    beforeEach(() => {
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
        let executor = new ControllerExecutor(info, new DefaultDependencyResolver(), HttpRequest)
        let result = <ViewActionResult>await executor.execute()
        Chai.expect(result.viewName).eq("index")
    })

    it("Should return File properly", async () => {
        let meta = H.fromFile("test/request-handler/controller/controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnFile")[0]
        info.classId = info.qualifiedClassName
        let executor = new ControllerExecutor(info, new DefaultDependencyResolver(), HttpRequest)
        let result = <FileActionResult>await executor.execute()
        Chai.expect(result.filePath).eq("/go/go/kamboja.js")
    })

    it("Should return Redirect properly", async () => {
        let meta = H.fromFile("test/request-handler/controller/controller.js")
        let infos = Transformer.transform(meta)
        let info = infos.filter(x => x.methodMetaData.name == "returnRedirect")[0]
        info.classId = info.qualifiedClassName
        let executor = new ControllerExecutor(info, new DefaultDependencyResolver(), HttpRequest)
        let result = <RedirectActionResult>await executor.execute()
        Chai.expect(result.redirectUrl).eq("/go/go/kamboja.js")
    })

})