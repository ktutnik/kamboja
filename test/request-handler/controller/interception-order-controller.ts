import { Controller, ApiController } from "../../../src/controller"
import { interceptor, Core, JsonActionResult } from "../../../src"

export class ConcatInterceptor implements Core.Interceptor {
    constructor(private msg: string) { }

    async intercept(invocation: Core.Invocation) {
        await invocation.execute();
        let result = (<JsonActionResult>invocation.returnValue).body;
        invocation.returnValue = new JsonActionResult(this.msg + ", " + result, undefined, undefined)
    }
}

@interceptor(new ConcatInterceptor("2"))
@interceptor(new ConcatInterceptor("3"))
export class InterceptedTestController extends ApiController {

    @interceptor(new ConcatInterceptor("0"))
    @interceptor(new ConcatInterceptor("1"))
    returnHello() {
        return "Hello"
    }
}