import * as Core from "kamboja-core"
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
        this.controllerInfo = {
            classId: this.routeInfo.classId,
            classMetaData: this.routeInfo.classMetaData,
            methodMetaData: this.routeInfo.methodMetaData,
            qualifiedClassName: this.routeInfo.qualifiedClassName
        }
    }

    async proceed(): Promise<Core.ActionResult> {
        let result = this.executor.execute(this.parameters)
        if (this.controllerInfo.classMetaData.baseClass == "ApiController")
            return InvocationResult.create(result, 200, "application/json")
        return InvocationResult.create(result, 200, "text/html")
    }
}