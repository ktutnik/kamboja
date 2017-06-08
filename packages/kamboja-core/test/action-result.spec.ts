import * as Chai from "chai"
import * as Core from "../src"
import * as Kecubung from "kecubung"
import * as Sinon from "sinon"
import * as Url from "url"
import { HttpRequest, HttpResponse } from "./helper"

describe("ActionResult", () => {
    let request: HttpRequest;
    let response: HttpResponse;

    beforeEach(() => {
        request = new HttpRequest()
        response = new HttpResponse()
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
    })

    it("Should give 200 if status not provided", async () => {
        let result = new Core.ActionResult("Halo")
        await result.execute(request, response, null)
        Chai.expect(response.status).eq(200)
    })

    it("Should give text/plain if type not provided", async () => {
        let result = new Core.ActionResult("Halo")
        await result.execute(request, response, null)
        Chai.expect(response.type).eq("text/plain")
    })
})