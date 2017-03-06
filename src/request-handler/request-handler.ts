import "reflect-metadata"
import * as Core from "../core"
import { ControllerInvocation } from "./controller-invocation"
import { InterceptorInvocation } from "./interceptor-invocation"
import { ControllerExecutor } from "./controller-executor"
import { Container } from "./container"

export class RequestHandler {
    constructor(private container: Container,
        private request: Core.HttpRequest,
        private response: Core.HttpResponse) { }

    async execute() {
        try {
            let controllerExecutor = new ControllerExecutor(
                this.container.controller, this.container.routeInfo, this.request, this.container.facade.autoValidation )
            let invocation: Core.Invocation = new ControllerInvocation(controllerExecutor, this.container.routeInfo, this.request)
            invocation.interceptors = this.container.interceptors
            for (let interceptor of this.container.interceptors) {
                invocation = new InterceptorInvocation(invocation, interceptor)
            }
            await invocation.execute()
            if (invocation.returnValue) {
                if (typeof invocation.returnValue["execute"] != "function") throw new Error(`Controller not return type of ActionResult in ${Core.getMethodName(this.container.routeInfo)}`)
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