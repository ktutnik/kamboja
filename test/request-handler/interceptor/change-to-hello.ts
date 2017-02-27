import { Controller, JsonActionResult } from "../../../src/controller"
import { interceptor } from "../../../src/request-handler/interceptor-decorator"
import { val, decoratorName, Interceptor, Invocation } from "../../../src"
import { id } from "./interceptor-identifier"

@id("ChangeToHello")
export class ChangeToHello implements Interceptor {
    async intercept(invocation: Invocation): Promise<void> {
        invocation.returnValue = new JsonActionResult("Hello world!", undefined, undefined)
    }
}