import { Controller, JsonActionResult } from "../../../src/controller"
import { val, Core } from "../../../src"
import { id } from "./interceptor-identifier"

@id("ChangeToHello")
export class ChangeToHello implements Core.RequestInterceptor {
    async intercept(invocation: Core.Invocation): Promise<void> {
        invocation.returnValue = new JsonActionResult("Hello world!", undefined, undefined)
    }
}