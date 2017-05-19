import { Controller, ApiController, ApiActionResult, HttpStatusError } from "../../src"
import * as H from "../helper"
import * as Chai from "chai"
import * as Core from "../../src/core"
import * as Kecubung from "kecubung"
import {HttpRequest, HttpResponse, Mock} from "../../src/test"
import * as Sinon from "sinon"

describe("ActionResult", () => {
    let request:Core.HttpRequest & Mock.Mockable<Core.HttpRequest, Sinon.SinonStub>
    let response:Core.HttpResponse & Mock.Mockable<Core.HttpResponse, Sinon.SinonSpy>

    beforeEach(() => {
        request = Mock.stub(new HttpRequest())
        response = Mock.spy(new HttpResponse())
    })

    it("Should fill response properties properly", async () => {
        let result = new Core.ActionResult("Halo", 400, "application/json", [{key: "Halo", value: "Hello"}])
        await result.execute(request, response, null)
        Chai.expect(response.body).eq("Halo")
        Chai.expect(response.status).eq(400)
        Chai.expect(response.type).eq("application/json")
        Chai.expect(response.cookies).deep.eq([{key: "Halo", value: "Hello"}])
        Chai.expect(response.MOCKS.send.called).true
    })

})