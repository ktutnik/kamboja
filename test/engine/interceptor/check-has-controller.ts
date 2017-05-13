import { Controller, JsonActionResult } from "../../../src/controller"
import { val, Core } from "../../../src"

export class CheckHasController implements Core.Middleware {
    async execute(request:Core.HttpRequest, invocation: Core.Invocation) {
        if (request.controllerInfo)
            return new JsonActionResult("HAS CONTROLLER", 200, undefined)
        else
            return new JsonActionResult("DOESN'T HAVE CONTROLLER", 200, undefined)
    }
}