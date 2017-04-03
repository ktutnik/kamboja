import { Controller, JsonActionResult, ViewActionResult } from "../../../src/controller"
import { val, Core } from "../../../src"

export class ReturnViewInterceptor implements Core.RequestInterceptor {
    async intercept(invocation: Core.Invocation) {
        return new ViewActionResult({}, "index", undefined)
    }
}