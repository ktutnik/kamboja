import * as Core from "../core"
import { ControllerExecutor } from "../engine/controller-executor"
import "reflect-metadata"
import * as Kecubung from "kecubung"
import { ParameterBinder } from "../parameter-binder"
import * as Url from "url"
import { InvocationResult } from "./invocation-result"

export class ControllerInvocation extends Core.Invocation {

    constructor(private executor: ControllerExecutor,
        private routeInfo: Core.RouteInfo,
        public request: Core.HttpRequest) {
        super()
        let parameterBinder = new ParameterBinder(this.routeInfo, this.request)
        this.parameters = parameterBinder.getParameters()
    }

    async proceed(): Promise<Core.ActionResult> {
        let result = this.executor.execute(this.parameters)
        return InvocationResult.create(result)
    }
}