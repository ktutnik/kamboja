import { Controller, JsonActionResult, ViewActionResult } from "../../../src/controller"
import { interceptor } from "../../../src/engine/interceptor-decorator"
import { val, Core } from "../../../src"

export class ReturnViewInterceptor implements Core.Interceptor {
    async intercept(invocation: Core.Invocation): Promise<void> {
        invocation.returnValue = new ViewActionResult({}, "index", undefined)
    }
}