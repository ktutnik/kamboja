import * as Core from "../core"
import { Binder } from "./parameter-binder"

export class ApiControllerExecutor implements Core.ExecutorCommand {
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
            let methodResult = method.apply(controller, this.binder.getParameters());
            if (methodResult) {
                let result = await Promise.resolve(methodResult);
                this.response.json(result)
            }
            else {
                this.response.end()
            }
        }
        catch (error) {
            this.response.error(error)
        }
    }
}