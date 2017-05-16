import { Controller, JsonActionResult, StatusActionResult } from "../../../src/controller"
import { val, Core } from "../../../src"

export class ErrorHandlerMiddleware implements Core.Middleware {
    async execute(request: Core.HttpRequest, invocation: Core.Invocation) {
        try {
            return await invocation.proceed()
        } catch (e) {
            return new StatusActionResult(501, "Error handled properly")
        }
    }
}