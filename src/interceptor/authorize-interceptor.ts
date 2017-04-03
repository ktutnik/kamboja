import { RequestInterceptor, Invocation, ActionResult } from "../core"
import { InterceptorDecorator } from "./interceptor-decorator"

let interceptor = new InterceptorDecorator()

@interceptor.id("kamboja:authorize")
export class AuthorizeInterceptor implements RequestInterceptor {
    constructor(public role: (string | string[])) { }

    async intercept(invocation: Invocation):Promise<ActionResult> {
        return invocation.execute()
    }
}