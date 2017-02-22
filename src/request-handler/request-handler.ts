import * as Core from "../core"
import { ControllerInvocation, InterceptorInvocation } from "./adapters"
import "reflect-metadata"
import * as Kecubung from "kecubung"
import { ValidatorImpl } from "../validator/validator"
import { ControllerExecutor } from "./controller-executor"

export class RequestHandler {
    constructor(private facade: Core.Facade,
        private routeInfo: Core.RouteInfo,
        private request: Core.HttpRequest,
        private response: Core.HttpResponse) { }

    async execute() {
        try {
            let invocation: Core.Invocation = new ControllerInvocation(this.facade, this.routeInfo, this.request)
            let interceptors = invocation.interceptors;
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