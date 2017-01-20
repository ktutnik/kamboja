import * as Core from "../core"
import {Binder} from "./binder"
import {Executor} from "./executor"

export class RequestHandlerImpl implements Core.RequestHandler {
    constructor(public routeInfo: Core.RouteInfo, private resolver: Core.DependencyResolver) { }

    onRequest(request: Core.HttpRequest, response:Core.HttpResponse) {
        let controller;
        try {
            controller = this.resolver.resolve<any>(this.routeInfo.classId);
        } catch (e) {
            throw Error(`Error: Unable to create instance of ${this.routeInfo.className}, with ID ${this.routeInfo.classId}`)
        }

        let binder = new Binder(this.routeInfo, request)
        let parameters = binder.getParameters();
        let executor = new Executor(controller, this.routeInfo.methodName, response)
        executor.execute()
    }
}




