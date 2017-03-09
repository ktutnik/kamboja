import "reflect-metadata"
import * as Core from "../core"
import { ControllerInvocation } from "./controller-invocation"
import { InterceptorInvocation } from "./interceptor-invocation"
import { ControllerExecutor } from "./controller-executor"
import { ControllerFactory } from "./factory"

export class RequestHandler {
    constructor(private container: ControllerFactory,
        private request: Core.HttpRequest,
        private response: Core.HttpResponse) { }

    async execute() {
        try {
            let controllerExecutor = new ControllerExecutor(this.container, this.request )
            let invocation: Core.Invocation = new ControllerInvocation(controllerExecutor, this.container.routeInfo, this.request)
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