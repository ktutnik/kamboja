import { Controller, JsonActionResult, ViewActionResult } from "../../../src/controller"
import { val, Core } from "../../../src"

export class ReturnViewInterceptor implements Core.Middleware {
    async execute(request:Core.HttpRequest, invocation: Core.Invocation) {
        return new ViewActionResult({}, "index", undefined)
    }
}