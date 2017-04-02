import { Controller, JsonActionResult } from "../../../src/controller"
import { interceptor } from "../../../src/engine/interceptor-decorator"
import { val, Core } from "../../../src"

export class ErrorInterceptor implements Core.Interceptor {
    async intercept(invocation: Core.Invocation): Promise<void> {
        throw new Error("ERROR INSIDE INTERCEPTOR")
    }
}