import * as Core from "../core"
import { Binder } from "./parameter-binder"

export class ControllerExecutor implements Core.ExecutorCommand {
    private binder: Binder;
    constructor(private routeInfo: Core.RouteInfo, 
        private resolver: Core.DependencyResolver, 
        private request: Core.HttpRequest, 
        private response: Core.HttpResponse) {
        this.binder = new Binder(routeInfo, request)
    }

    async execute() {
        try {
            let controller = this.resolver.resolve(this.routeInfo.classId)
            let method = <Function>controller[this.routeInfo.methodMetaData.name]
            let actionResult = <Core.ActionResult>method.apply(controller, this.binder.getParameters());
            if(actionResult && actionResult["execute"])
                actionResult.execute(this.response, this.routeInfo)
            else this.response.error(new Error("Controller must return ActionResult"))
        }
        catch (error) {
            this.response.error(error)
        }
    }
}