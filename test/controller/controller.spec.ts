import { Controller, ApiController } from "../../src/controller"
import * as H from "../helper"
import * as Chai from "chai"
import * as Core from "../../src/core"
import * as Sinon from "sinon"

let RouteInfo: any = {
    className: 'SimpleController, .simple-controller.js',
    methodMetaData:
    {
        name: 'myMethod',
    }
}

let HttpResponse: any = {
    view: function () { },
    file: function () { },
    redirect: function () { },
    json:function(){}
};

describe("ApiController", () => {
    it("Should instantiate properly", () => {
        let api = new ApiController();
        Chai.expect(api).not.null;
    })
})

describe("Controller", () => {
    describe("view", () => {
        let spy: Sinon.SinonSpy;

        beforeEach(() => {
            spy = Sinon.spy(HttpResponse, "view")
        })

        afterEach(() => {
            spy.restore();
        })

        it("Should able to called without view name", () => {
            let controller = new Controller()
            //called without view name
            let view = controller.view({});
            view.execute(HttpResponse, RouteInfo)
            let viewName = spy.getCall(0).args[0]
            Chai.expect(viewName).eq("simple/mymethod")
        })

        it("Should able to called with view name on controller scope", () => {
            let controller = new Controller()
            let view = controller.view({}, "index");
            view.execute(HttpResponse, RouteInfo)
            let viewName = spy.getCall(0).args[0]
            Chai.expect(viewName).eq("simple/index")
        })

        it("Should able to called with view name outside controller", () => {
            let controller = new Controller()
            let view = controller.view({}, "other/index");
            view.execute(HttpResponse, RouteInfo)
            let viewName = spy.getCall(0).args[0]
            Chai.expect(viewName).eq("other/index")
        })

        it("Should provide correct view name when controller name not end with 'controller'", () => {
            let controller = new Controller()
            //called without view name
            let view = controller.view({});
            view.execute(HttpResponse, <any>{
                className: 'Proud, .simple-controller.js',
                methodMetaData:
                {
                    name: 'myMethod',
                }
            })
            let viewName = spy.getCall(0).args[0]
            Chai.expect(viewName).eq("proud/mymethod")
        })
    })

    describe("file", () => {
        let spy: Sinon.SinonSpy;

        beforeEach(() => {
            spy = Sinon.spy(HttpResponse, "file")
        })

        afterEach(() => {
            spy.restore();
        })

        it("Should provide file path properly", () => {
            let controller = new Controller()
            let view = controller.file("./go/go/kamboja.js");
            view.execute(HttpResponse, RouteInfo)
            let viewName = spy.getCall(0).args[0]
            Chai.expect(viewName).eq("./go/go/kamboja.js")
        })
    })

    describe("redirect", () => {
        let spy: Sinon.SinonSpy;

        beforeEach(() => {
            spy = Sinon.spy(HttpResponse, "redirect")
        })

        afterEach(() => {
            spy.restore();
        })

        it("Should provide redirect path properly", () => {
            let controller = new Controller()
            let view = controller.redirect("./go/go/kamboja.js");
            view.execute(HttpResponse, RouteInfo)
            let viewName = spy.getCall(0).args[0]
            Chai.expect(viewName).eq("./go/go/kamboja.js")
        })
    })

    describe("json", () => {
        let spy: Sinon.SinonSpy;

        beforeEach(() => {
            spy = Sinon.spy(HttpResponse, "json")
        })

        afterEach(() => {
            spy.restore();
        })

        it("Should provide json body properly", () => {
            let controller = new Controller()
            let view = controller.json({ data: "Hello!" });
            view.execute(HttpResponse, RouteInfo)
            let viewName = spy.getCall(0).args[0]
            Chai.expect(viewName).deep.eq({ data: "Hello!" })
        })
    })
})