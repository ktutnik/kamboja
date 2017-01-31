import * as Core from "../core"
import { ExecutorCommand } from "./baseclasses"
import { ApiControllerExecutor } from "./api-controller-executor"
import { ControllerExecutor } from "./controller-executor"


export class Executor {
    apiControllerExecutor: ExecutorCommand;
    controllerExecutor: ExecutorCommand;

    //execute controller based on controller type: APIController or Controller
    constructor(private routeInfo: Core.RouteInfo, resolver: Core.DependencyResolver, response: Core.HttpResponse) {
        this.controllerExecutor = new ControllerExecutor(routeInfo, resolver, response)
        this.apiControllerExecutor = new ApiControllerExecutor(routeInfo, resolver, response)
    }
    execute(parameters: any[]) {
        switch (this.routeInfo.baseClass) {
            case "ApiController":
                return this.apiControllerExecutor.execute(parameters);
            case "Controller":
                return this.controllerExecutor.execute(parameters)
            default:
                throw new Error("Error: Unknown controller base class")
        }
    }
}