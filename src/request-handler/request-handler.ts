import * as Core from "../core"
import { ApiControllerExecutor } from "./api-controller-executor"
import { ControllerExecutor } from "./controller-executor"


export class RequestHandler {
    private apiCommand: ApiControllerExecutor;
    private controllerCommand: ControllerExecutor;

    constructor(private routeInfo: Core.RouteInfo,
        private options:Core.KambojaOption,
        resolver: Core.DependencyResolver,
        request: Core.HttpRequest,
        response: Core.HttpResponse) {
        this.apiCommand = new ApiControllerExecutor(routeInfo,  resolver, request, response)
        this.controllerCommand = new ControllerExecutor(routeInfo, resolver, request, response)
    }

    execute() {
        switch (this.routeInfo.baseClass) {
            case "ApiController":
                return this.apiCommand.execute();
            case "Controller":
                return this.controllerCommand.execute();
        }
    }
}