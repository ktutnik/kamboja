import * as Core from "../core"
import { ControllerExecutor } from "../engine/controller-executor"
import "reflect-metadata"
import * as Kecubung from "kecubung"
import { getInterceptors } from "./interceptor-decorator"
import { ParameterBinder } from "../parameter-binder"

export class ControllerInvocation extends Core.Invocation {
    
    constructor(private executor: ControllerExecutor,
        private routeInfo: Core.RouteInfo,
        public request: Core.HttpRequest) {
        super()
        this.url = request.url
        this.methodName = routeInfo.methodMetaData.name
        this.classMetaData = routeInfo.classMetaData
        let parameterBinder = new ParameterBinder(this.routeInfo, this.request)
        this.parameters = parameterBinder.getParameters()
    }

    async execute(): Promise<void> {
        this.returnValue = await this.executor.execute(this.parameters)
    }
}