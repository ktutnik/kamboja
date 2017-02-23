import * as Core from "../core"
import { ControllerInvocation } from "./controller-invocation"
import { InterceptorInvocation } from "./interceptor-invocation"
import "reflect-metadata"
import * as Kecubung from "kecubung"
import { ValidatorImpl } from "../validator/validator"
import { ControllerExecutor } from "./controller-executor"
import { InterceptorBuilder } from "./interceptor-builder"

export class RequestHandler {
    constructor(private facade: Core.Facade,
        private routeInfo: Core.RouteInfo,
        private request: Core.HttpRequest,
        private response: Core.HttpResponse) { }

    async execute() {
        try {
            let invocation: Core.Invocation = new ControllerInvocation(this.facade, this.routeInfo, this.request)
            let interceptorBuilder = new InterceptorBuilder((<ControllerInvocation>invocation).controller, this.facade, this.routeInfo)
            let interceptors = interceptorBuilder.getInterceptors();
            invocation.interceptors = interceptors
            for (let interceptor of interceptors) {
                invocation = new InterceptorInvocation(invocation, interceptor)
            }
            await invocation.execute()
            if (invocation.returnValue)
                invocation.returnValue.execute(this.response, this.routeInfo)
            else
                this.response.end()
        }
        catch (e) {
            this.response.error(e)
        }
    }
}