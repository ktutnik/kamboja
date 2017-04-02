import { Controller, JsonActionResult } from "../../../src/controller"
import { interceptor } from "../../../src/engine/interceptor-decorator"
import { val, Core } from "../../../src"

export class CheckHasController implements Core.Interceptor {
    async intercept(invocation: Core.Invocation): Promise<void> {
        if (invocation.hasController())
            invocation.returnValue = new JsonActionResult("HAS CONTROLLER", 200, undefined)
        else
            invocation.returnValue = new JsonActionResult("DOESN'T HAVE CONTROLLER", 200, undefined)
    }
}