import "reflect-metadata"
import * as Core from "../core"
import { ControllerInvocation } from "./controller-invocation"
import { InterceptorInvocation } from "./interceptor-invocation"
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
        let invocation: Core.Invocation;
        try {
            if (this.container.routeInfo) {
                let controllerExecutor = new ControllerExecutor(this.container, this.request)
                invocation = new ControllerInvocation(controllerExecutor, this.container.routeInfo, this.request)
            }
            else {
                invocation = new PageNotFoundInvocation(this.request, this.response)
            }
            let interceptors = this.container.createInterceptors()
            invocation.interceptors = this.container.createInterceptors()
            for (let interceptor of interceptors) {
                invocation = new InterceptorInvocation(invocation, interceptor, this.option)
            }
            let result = await invocation.execute()

            if (result) {
                if (typeof result["execute"] != "function") throw new Error(`Controller does not return type of ActionResult in ${Core.getRouteDetail(this.container.routeInfo)}`)
                result.execute(this.request, this.response, this.container.routeInfo)
            }
            else
                this.response.end()
        }
        catch (e) {
            if (invocation.hasController() && invocation.classMetaData.baseClass == "ApiController")
                this.apiControllerErrorHandler(e, this.container.routeInfo)
            else this.defaultErrorHandler(e)
        }
    }

    private apiControllerErrorHandler(e, routeInfo: Core.RouteInfo) {
        if (this.option.errorHandler) {
            this.option.errorHandler(new Core.HttpError(e.status || 500, e, this.request, this.response))
        }
        else {
            let result = new ApiActionResult(e.message, e.status || 500)
            result.execute(this.request, this.response, routeInfo)
        }
    }

    private defaultErrorHandler(e) {
        this.response.error(e, e.status || 500)
    }
}