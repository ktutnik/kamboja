import { Controller, ApiController } from "../../../src/controller"
import { interceptor, Interceptor, Invocation, JsonActionResult } from "../../../src"

export class ConcatInterceptor implements Interceptor {
    constructor(private msg: string) { }

    async intercept(invocation: Invocation) {
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