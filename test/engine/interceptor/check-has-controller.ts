import { Controller, JsonActionResult } from "../../../src/controller"
import { val, Core } from "../../../src"

export class CheckHasController implements Core.RequestInterceptor {
    async intercept(invocation: Core.Invocation) {
        if (invocation.hasController())
            return new JsonActionResult("HAS CONTROLLER", 200, undefined)
        else
            return new JsonActionResult("DOESN'T HAVE CONTROLLER", 200, undefined)
    }
}