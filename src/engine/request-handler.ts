import "reflect-metadata"
import * as Core from "../core"
import { ControllerInvocation } from "./controller-invocation"
import { MiddlewareInvocation } from "./interceptor-invocation"
import { ControllerExecutor } from "./controller-executor"
import { PageNotFoundInvocation } from "./page-not-found-invocation"
import { ControllerFactory } from "./factory"
import { HttpStatusError, ApiActionResult } from "../controller"

export class RequestHandler {
    constructor(private container: ControllerFactory,
        private request: Core.HttpRequest,
        private response: Core.HttpResponse,
        private option: Core.KambojaOption) { }

    async execute() {
        try {
            let invocation: Core.Invocation;
            if (this.container.routeInfo) {
                let controllerExecutor = new ControllerExecutor(this.container, this.request)
                invocation = new ControllerInvocation(controllerExecutor, this.container.routeInfo, this.request)
                this.request.controllerInfo = {
                    classId: this.container.routeInfo.classId,
                    classMetaData: this.container.routeInfo.classMetaData,
                    methodMetaData: this.container.routeInfo.methodMetaData,
                    qualifiedClassName: this.container.routeInfo.qualifiedClassName
                }
            }
            else { 
                invocation = new PageNotFoundInvocation(this.request, this.response)
            }
            let middlewares = this.container.createMiddlewares()
            this.request.middlewares = this.container.createMiddlewares()
            for (let middleware of middlewares) {
                invocation = new MiddlewareInvocation(invocation, this.request, middleware, this.option)
            }
            let result = await invocation.proceed()
            result.execute(this.request, this.response, this.container.routeInfo)
        }
        catch (e) {
            if (this.container.routeInfo) {
                e.routeInfo = this.container.routeInfo;
            }
            this.response.error(e, e.status || 500)
        }
    }
}