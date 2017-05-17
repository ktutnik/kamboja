import { Controller, JsonActionResult, StatusActionResult } from "../../../src/controller"
import { val, Core } from "../../../src"

export class ErrorHandlerMiddleware implements Core.Middleware {
    constructor(private callback?: (i: Core.Invocation) => void) { }
    async execute(request: Core.HttpRequest, invocation: Core.Invocation) {
        try {
            return await invocation.proceed()
        } catch (e) {
            if (this.callback) this.callback(invocation)
            return new StatusActionResult(501, "Error handled properly")
        }
    }
}