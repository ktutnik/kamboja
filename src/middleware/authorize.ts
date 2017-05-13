import { Middleware, Invocation, ActionResult, HttpRequest } from "../core"
import { MiddlewareDecorator } from "./middleware-decorator"

let interceptor = new MiddlewareDecorator()

@interceptor.id("kamboja:authorize")
export class Authorize implements Middleware {
    constructor(public role: (string | string[])) { }

    execute(request: HttpRequest, invocation: Invocation):Promise<ActionResult> {
        return invocation.proceed()
    }
}