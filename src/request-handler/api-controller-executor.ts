import * as Core from "../core"
import { ParameterBinder } from "./parameter-binder"
import {JsonActionResult} from "../controller"

export class ApiControllerExecutor implements Core.ExecutorCommand {
    private binder: ParameterBinder;
    constructor(private routeInfo: Core.RouteInfo,
        private resolver: Core.DependencyResolver,
        private request: Core.HttpRequest) {
        this.binder = new ParameterBinder(routeInfo, request)
    }

    async execute() {
        let controller = this.resolver.resolve(this.routeInfo.classId)
        let method = <Function>controller[this.routeInfo.methodMetaData.name]
        let methodResult = method.apply(controller, this.binder.getParameters());
        let result = await Promise.resolve(methodResult);
        return new JsonActionResult(result);
    }
}