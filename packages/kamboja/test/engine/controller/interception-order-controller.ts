import { Controller, ApiController } from "../../../src/controller"
import { Middleware, Core } from "../../../src"

let middleware = new Middleware.MiddlewareDecorator()

export class ConcatInterceptor implements Core.Middleware {
    constructor(private msg: string) { }

    async execute(request:Core.HttpRequest, invocation: Core.Invocation) {
        let invocationResult = await invocation.proceed();
        let result = invocationResult.body;
        return this.msg + ", " + result
    }
}

@middleware.use(new ConcatInterceptor("2"))
@middleware.use(new ConcatInterceptor("3"))
export class InterceptedTestController extends ApiController {

    @middleware.use(new ConcatInterceptor("0"))
    @middleware.use(new ConcatInterceptor("1"))
    returnHello() {
        return "Hello"
    }
}