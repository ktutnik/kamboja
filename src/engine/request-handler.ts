import "reflect-metadata"
import * as Core from "../core"
import { ControllerInvocation } from "./controller-invocation"
import { InterceptorInvocation } from "./interceptor-invocation"
import { ControllerExecutor } from "./controller-executor"
import { PageNotFoundInvocation } from "./page-not-found-invocation"
import { ControllerFactory } from "./factory"

export class RequestHandler {
    constructor(private container: ControllerFactory, 
        private request: Core.HttpRequest,
        private response: Core.HttpResponse) { }

    async execute() {
        try {
            let invocation: Core.Invocation;
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
                invocation = new InterceptorInvocation(invocation, interceptor)
            }
            await invocation.execute()
            if (invocation.returnValue) {
                if (typeof invocation.returnValue["execute"] != "function") throw new Error(`Controller not return type of ActionResult in ${Core.getRouteDetail(this.container.routeInfo)}`)
                invocation.returnValue.execute(this.response, this.container.routeInfo)
            }
            else
                this.response.end()
        }
        catch (e) {
            this.response.error(e)
        }
    }
}