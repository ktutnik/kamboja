import * as Chai from "chai"
import { InvocationResult } from "../../src/engine/invocation-result"
import { ApiActionResult, JsonActionResult, Core } from "../../src"
import * as H from "../helper"

describe("InvocationResult", () => {
    let responseMock: H.Spies<H.HttpResponse>
    let httpResponse: H.HttpResponse
    let requestMock: H.Stubs<H.HttpRequest>
    let httpRequest: H.HttpRequest
    let facade: Core.Facade

    beforeEach(() => {
        responseMock = H.spy(new H.HttpResponse());
        httpResponse = <H.HttpResponse><any>responseMock
        requestMock = H.stub(new H.HttpRequest())
        httpRequest = <H.HttpRequest><any>requestMock
        facade = H.createFacade(__dirname)
    })

    afterEach(() => {
        H.restore(responseMock)
        H.restore(requestMock)
    })

    it("Should allow primitive value result", async () => {
        let result = await InvocationResult.create("Hello")
        let actionResult = <ApiActionResult>result
        Chai.expect(actionResult.body).eq("Hello")
        result.execute(httpRequest, httpResponse, {})
    })

    it("Should allow undefined value result", async () => {
        let result = await InvocationResult.create(undefined)
        let actionResult = <ApiActionResult>result
        Chai.expect(actionResult.body).eq(undefined)
    })

    it("Should allow ActionResult result", async () => {
        let result = await InvocationResult.create(new JsonActionResult({ message: "Hello" }))
        let actionResult = <JsonActionResult>result
        Chai.expect(actionResult.body).deep.eq({ message: "Hello" })
    })

    it("Should allow Promise value result", async () => {
        let result = await InvocationResult.create(Promise.resolve("Hello"))
        let actionResult = <ApiActionResult>result
        Chai.expect(actionResult.body).eq("Hello")
    })

    it("Should allow Promise of ActionResult", async () => {
        let result = await InvocationResult.create(Promise.resolve(new JsonActionResult({ message: "Hello" })))
        let actionResult = <JsonActionResult>result
        Chai.expect(actionResult.body).deep.eq({ message: "Hello" })
    })
})