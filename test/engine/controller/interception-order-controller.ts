import { Controller, ApiController } from "../../../src/controller"
import { middleware, Core, JsonActionResult } from "../../../src"

export class ConcatInterceptor implements Core.Middleware {
    constructor(private msg: string) { }

    async execute(request:Core.HttpRequest, invocation: Core.Invocation):Promise<Core.ActionResult> {
        let invocationResult = await invocation.proceed();
        let result = (<JsonActionResult>invocationResult).body;
        return new JsonActionResult(this.msg + ", " + result)
    }
}

@middleware.add(new ConcatInterceptor("2"))
@middleware.add(new ConcatInterceptor("3"))
export class InterceptedTestController extends ApiController {

    @middleware.add(new ConcatInterceptor("0"))
    @middleware.add(new ConcatInterceptor("1"))
    returnHello() {
        return "Hello"
    }
}