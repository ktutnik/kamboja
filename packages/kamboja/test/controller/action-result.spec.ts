import { Controller, ApiController, ApiActionResult, HttpStatusError } from "../../src"
import * as H from "../helper"
import * as Chai from "chai"
import * as Core from "../../src/core"
import * as Kecubung from "kecubung"
import { Test } from "../../src"
import * as Sinon from "sinon"

describe("ActionResult", () => {
    let request: Core.HttpRequest & Test.Mockable<Core.HttpRequest, Sinon.SinonStub>
    let response: Core.HttpResponse & Test.Mockable<Core.HttpResponse, Sinon.SinonSpy>

    beforeEach(() => {
        request = H.stub(new Test.HttpRequest())
        response = H.spy(new Test.HttpResponse())
    })

    it("Should fill response properties properly", async () => {
        let result = new Core.ActionResult("Halo", 400, "application/json")
        result.cookies = [{ key: "Halo", value: "Hello" }]
        result.header = { Accept: "text/*, application/json" }
        await result.execute(request, response, null)
        Chai.expect(response.body).eq("Halo")
        Chai.expect(response.status).eq(400)
        Chai.expect(response.type).eq("application/json")
        Chai.expect(response.cookies).deep.eq([{ key: "Halo", value: "Hello" }])
        Chai.expect(response.header).deep.eq({ Accept: "text/*, application/json" })
        Chai.expect(response.MOCKS.send.called).true
    })

})