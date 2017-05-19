import "reflect-metadata"
import * as Core from "../core"
import { ControllerInvocation } from "./controller-invocation"
import { MiddlewareInvocation } from "./middleware-invocation"
import { ControllerExecutor } from "./controller-executor"
import { PageNotFoundInvocation } from "./page-not-found-invocation"
import { ErrorInvocation } from "./error-invocation"
import { ControllerFactory } from "./controller-factory"
import { MiddlewareFactory } from "./middleware-factory"
import { HttpStatusError, ApiActionResult } from "../controller"

export class RequestHandler {
    constructor(private option: Core.Facade,
        private request: Core.HttpRequest,
        private response: Core.HttpResponse,
        private info?: Core.RouteInfo | Error) { }

    async execute() {
        let invocation: Core.Invocation;
        let controller: Core.BaseController;
        let routeInfo: Core.RouteInfo;
        try {
            if (!this.info) {
                invocation = new PageNotFoundInvocation(this.request, this.response)
            }
            else if (this.info instanceof Error) {
                invocation = new ErrorInvocation(this.request, this.response, this.info, this.option.routeInfos)
            }
            else {
                routeInfo = this.info;
                let factory = new ControllerFactory(this.option, routeInfo)
                controller = factory.createController()
                let controllerExecutor = new ControllerExecutor(factory, this.request)
                invocation = new ControllerInvocation(controllerExecutor, routeInfo, this.request)
            }
            let factory = new MiddlewareFactory(this.option, controller, routeInfo)
            let middlewares = factory.createMiddlewares()
            invocation.middlewares = middlewares
            for (let middleware of middlewares) {
                invocation = new MiddlewareInvocation(invocation, this.request, middleware)
            }
            let result = await invocation.proceed()
            await result.execute(this.request, this.response, routeInfo)
        }
        catch (e) {
            this.response.body = e.message
            this.response.status = e.status || 500
            this.response.send()
        }
    }
}