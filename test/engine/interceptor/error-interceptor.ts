import { Controller, JsonActionResult } from "../../../src/controller"
import { val, Core } from "../../../src"

export class ErrorInterceptor implements Core.Middleware {
    async execute(request:Core.HttpRequest, invocation: Core.Invocation): Promise<Core.ActionResult> {
        throw new Error("ERROR INSIDE INTERCEPTOR")
    }
}