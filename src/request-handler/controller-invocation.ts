import * as Core from "../core"
import { ControllerExecutor } from "../request-handler/controller-executor"
import "reflect-metadata"
import * as Kecubung from "kecubung"
import { getInterceptors } from "./interceptor-decorator"
import { ParameterBinder } from "../parameter-binder"

export class ControllerInvocation extends Core.Invocation {
    private executor: ControllerExecutor
    constructor(public controller: Core.BaseController,
        private routeInfo: Core.RouteInfo,
        private request: Core.HttpRequest) {
        super()
        this.methodName = routeInfo.methodMetaData.name
        this.classMetaData = routeInfo.classMetaData
        let parameterBinder = new ParameterBinder(this.routeInfo, this.request)
        this.parameters = parameterBinder.getParameters()
        this.executor = new ControllerExecutor(controller, this.routeInfo, this.request)
    }

    async execute(): Promise<void> {
        this.returnValue = await this.executor.execute(this.parameters)
    }
}