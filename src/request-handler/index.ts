import * as Core from "../core"
import {Binder} from "./binder"
import {Executor} from "../controller"

export class RequestHandler implements Core.RequestHandler {
    constructor(public routeInfo: Core.RouteInfo, private resolver: Core.DependencyResolver) { }

    onRequest(request: Core.HttpRequest, response:Core.HttpResponse) {
        let binder = new Binder(this.routeInfo, request)
        let executor = new Executor(this.routeInfo, this.resolver, response)
        executor.execute(binder.getParameters())
    }
}




