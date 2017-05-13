import { Controller } from "../../../src/controller"
import { middleware } from "../../../src"
import { val, JsonActionResult, Core } from "../../../src"
import { id } from "../interceptor/interceptor-identifier"

@id("ChangeValueToHelloWorld")
export class ChangeValueToHelloWorld implements Core.Middleware {
    async execute(request:Core.HttpRequest, invocation: Core.Invocation) {
       return new JsonActionResult("Hello world!", undefined, undefined)
    }
}

@middleware.add("DefaultInterceptor, interceptor/default-interceptor")
@middleware.add(new ChangeValueToHelloWorld())
export class DummyApi extends Controller {

    @middleware.add("DefaultInterceptor, interceptor/default-interceptor")
    @middleware.add(new ChangeValueToHelloWorld())
    returnView() {
        return this.json("Helow")
    }
}