import * as Core from "../core"
import { ControllerExecutor } from "../engine/controller-executor"
import "reflect-metadata"
import * as Kecubung from "kecubung"
import { ParameterBinder } from "../parameter-binder"
import { InvocationResult } from "./invocation-result"

export class MiddlewareInvocation extends Core.Invocation {
    constructor(private invocation: Core.Invocation,
        private request: Core.HttpRequest,
        private middleware: Core.Middleware) { super() }

    async proceed(): Promise<Core.ActionResult> {
        let result = this.middleware.execute(this.request, this.invocation)
        return await InvocationResult.create(result)
    }
}
