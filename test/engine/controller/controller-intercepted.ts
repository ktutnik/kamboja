import { Controller } from "../../../src/controller"
import { interceptor } from "../../../src"
import { val, JsonActionResult, Core } from "../../../src"
import { id } from "../interceptor/interceptor-identifier"

@id("ChangeValueToHelloWorld")
export class ChangeValueToHelloWorld implements Core.RequestInterceptor {
    async intercept(invocation: Core.Invocation): Promise<void> {
        invocation.returnValue = new JsonActionResult("Hello world!", undefined, undefined)
    }
}

@interceptor.add("DefaultInterceptor, interceptor/default-interceptor")
@interceptor.add(new ChangeValueToHelloWorld())
export class DummyApi extends Controller {

    @interceptor.add("DefaultInterceptor, interceptor/default-interceptor")
    @interceptor.add(new ChangeValueToHelloWorld())
    returnView() {
        return this.json("Helow")
    }
}