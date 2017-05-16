import { Controller } from "../../../src/controller"
import { Middleware } from "../../../src"
import { val, JsonActionResult, Core } from "../../../src"
import { id } from "../interceptor/interceptor-identifier"

let middleware = new Middleware.MiddlewareDecorator()

@id("ChangeValueToHelloWorld")
export class ChangeValueToHelloWorld implements Core.Middleware {
    async execute(request:Core.HttpRequest, invocation: Core.Invocation) {
       return new JsonActionResult("Hello world!", undefined, undefined)
    }
}

@middleware.use("DefaultInterceptor, interceptor/default-interceptor")
@middleware.use(new ChangeValueToHelloWorld())
export class DummyApi extends Controller {

    @middleware.use("DefaultInterceptor, interceptor/default-interceptor")
    @middleware.use(new ChangeValueToHelloWorld())
    returnView() {
        return this.json("Helow")
    }
}