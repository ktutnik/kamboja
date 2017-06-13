import * as Chai from "chai"
import * as Core from "../src"
import * as Kecubung from "kecubung"
import { HttpRequest, HttpResponse } from "./helper"

class Invocation extends Core.Invocation{
    async proceed() {
        return new Core.ActionResult({});
    }
}

describe("Core", () => {
    it("Instantiate HttpError properly", () => {
        let httpError = new Core.HttpError(200, null, new HttpRequest(), new HttpResponse())
        Chai.expect(httpError).not.null;
    })

    it("Should instantiate HttpRequest properly", () => {
        let request = new HttpRequest();
        request.getCookie("")
        request.getHeader("")
        request.getParam("")
        request.getUserRole()
        request.getAccepts("")
        request.isAuthenticated()
    })

    it("Should instantiate decorator properly", () => {
        let decorator = new Core.Decorator();
        let fun = decorator.internal()
        fun(null, "", {})
        Chai.expect(typeof fun == "function").true
    
    })

    it("Should instantiate HttpError properly", () => {
        let err = new Core.HttpError(200, {message:"halo"}, new HttpRequest(), new HttpResponse());
        Chai.expect(err.status).eq(200)
        Chai.expect(err.error.message).eq("halo")
    })

    it("Should instantiate Invocation properly", () => {
        let err = new Invocation()
        Chai.expect(err.proceed()).not.null;
    })

    it("Should instantiate http decorator properly", () => {
        let decorator = new Core.HttpDecorator();
        let fun = decorator.delete()
        fun(null, "", {})
        Chai.expect(typeof fun == "function").true
        fun = decorator.get()
        fun(null, "", {})
        Chai.expect(typeof fun == "function").true
        fun = decorator.patch()
        fun(null, "", {})
        Chai.expect(typeof fun == "function").true
        fun = decorator.post()
        fun(null, "", {})
        Chai.expect(typeof fun == "function").true
        fun = decorator.put()
        fun(null, "", {})
        Chai.expect(typeof fun == "function").true
        fun = decorator.root("")
        fun(null, "", {})
        Chai.expect(typeof fun == "function").true
    })

    it("Should get routeinfo properly", () => {
        let result = Core.getRouteDetail({ 
            qualifiedClassName: "BookModel, model/book-model", 
            methodMetaData: <Kecubung.MethodMetaData>{ name: "getData" } 
        })
        Chai.expect(result).eq("[BookModel.getData model/book-model]")
    })
})

describe("MetaDataHelper", () => {
    it("Should save and get metadata properly on class scope", () => {
        Core.MetaDataHelper.save("MY-KEY-123", "HELLO-123", [Invocation.constructor])
        Chai.expect(Core.MetaDataHelper.get("MY-KEY-123", Invocation.constructor)).deep.eq(["HELLO-123"])
    })

    it("Should save and get metadata properly on method scope", () => {
        Core.MetaDataHelper.save("MY-KEY-123", "HELLO-123", [Invocation.prototype, "proceed"])
        Chai.expect(Core.MetaDataHelper.get("MY-KEY-123", new Invocation(), "proceed")).deep.eq(["HELLO-123"])
    })

    it("Should not return undefined if provided undefined target", () => {
        Chai.expect(Core.MetaDataHelper.get("MY-KEY-123", undefined, "proceed")).deep.eq([])
    })
})