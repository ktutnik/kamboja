import { Interceptor, authorize, Core } from "../../src"
import * as Chai from "chai"

describe("Authorize Interceptor", () => {
    
    it("Should instantiate properly", () => {
        let result = authorize("admin")
        Chai.expect(typeof result).eq("function")

    })

    it("Should provide role properly", async () => {
        let auth = new Interceptor.AuthorizeInterceptor("admin")
        await auth.intercept(<Core.Invocation>{ execute: () => { } })
        Chai.expect(auth.role).eq("admin")

        auth = new Interceptor.AuthorizeInterceptor(["admin", "user"])
        await auth.intercept(<Core.Invocation>{ execute: () => { } })
        Chai.expect(auth.role).deep.eq(["admin", "user"])
    })

    it("Should identify authorize in method properly", () => {
        let auth = new Interceptor.AuthorizeInterceptor(undefined)
        let id = Interceptor.getId(auth)
        Chai.expect(id).eq("kamboja:authorize")
    })

    it("Should return undefined if no authorize detected", () => {
        let auth = {}
        let id = Interceptor.getId(auth)
        Chai.expect(id).undefined
    })
})