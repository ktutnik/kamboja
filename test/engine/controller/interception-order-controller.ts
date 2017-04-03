import { Controller, ApiController } from "../../../src/controller"
import { interceptor, Core, JsonActionResult } from "../../../src"

export class ConcatInterceptor implements Core.RequestInterceptor {
    constructor(private msg: string) { }

    async intercept(invocation: Core.Invocation):Promise<Core.ActionResult> {
        let invocationResult = await invocation.execute();
        let result = (<JsonActionResult>invocationResult).body;
        return new JsonActionResult(this.msg + ", " + result, undefined, undefined)
    }
}

@interceptor.add(new ConcatInterceptor("2"))
@interceptor.add(new ConcatInterceptor("3"))
export class InterceptedTestController extends ApiController {

    @interceptor.add(new ConcatInterceptor("0"))
    @interceptor.add(new ConcatInterceptor("1"))
    returnHello() {
        return "Hello"
    }
}