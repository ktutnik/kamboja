import { ExecutorCommand } from "./baseclasses"
import * as Core from "../core"

export class ControllerExecutor implements ExecutorCommand {
    constructor(private routeInfo: Core.RouteInfo, private resolver: Core.DependencyResolver, private response: Core.HttpResponse) { }

    async execute(parameters: any[]) {
        let controller = this.resolver.resolve(this.routeInfo.classId)
        let method = <Function>controller[this.routeInfo.methodMetaData.name]
        let actionResult = <Core.ActionResult>method.apply(controller, parameters);
        actionResult.execute(this.response)
    }
}