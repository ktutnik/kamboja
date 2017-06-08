import { Middleware, Invocation, ActionResult, HttpRequest } from "kamboja-core"
import { MiddlewareDecorator } from "./middleware-decorator"

let middleware = new MiddlewareDecorator()

@middleware.id("kamboja:authorize")
export class Authorize implements Middleware {
    constructor(public role: (string | string[])) { }

    execute(request: HttpRequest, invocation: Invocation):Promise<ActionResult> {
        return invocation.proceed()
    }
}