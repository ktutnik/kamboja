import { Middleware, authorize, Core } from "../../src"
import * as Chai from "chai"

describe("Authorize", () => {

    it("Should instantiate properly", () => {
        let result = authorize("admin")
        Chai.expect(typeof result).eq("function")

    })

    it("Should provide role properly", async () => {
        let auth = new Middleware.Authorize("admin")
        await auth.execute(<Core.HttpRequest>{}, <Core.Invocation>{ proceed: () => { } })
        Chai.expect(auth.role).eq("admin")

        auth = new Middleware.Authorize(["admin", "user"])
        await auth.execute(<Core.HttpRequest>{}, <Core.Invocation>{ proceed: () => { } })
        Chai.expect(auth.role).deep.eq(["admin", "user"])
    })

    it("Should identify authorize in method properly", () => {
        let auth = new Middleware.Authorize(undefined)
        let id = Middleware.getId(auth)
        Chai.expect(id).eq("kamboja:authorize")
    })

    it("Should return undefined if no authorize detected", () => {
        let auth = {}
        let id = Middleware.getId(auth)
        Chai.expect(id).undefined
    })
})