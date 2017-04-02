import { Controller, JsonActionResult } from "../../../src/controller"
import { val, Core } from "../../../src"

export class ErrorInterceptor implements Core.RequestInterceptor {
    async intercept(invocation: Core.Invocation): Promise<void> {
        throw new Error("ERROR INSIDE INTERCEPTOR")
    }
}