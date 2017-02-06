import * as Core from "../core"
import { ParameterBinder } from "../parameter-binder"

export class ControllerExecutor implements Core.ExecutorCommand {
    private binder: ParameterBinder;
    constructor(private routeInfo: Core.RouteInfo,
        private resolver: Core.DependencyResolver,
        private request: Core.HttpRequest) {
        this.binder = new ParameterBinder(routeInfo, request)
    }

    async execute() {
        let controller = this.resolver.resolve(this.routeInfo.classId)
        let method = <Function>controller[this.routeInfo.methodMetaData.name]
        let result = method.apply(controller, this.binder.getParameters());
        return <Promise<Core.ActionResult>>Promise.resolve(result);
    }
}