import { Controller } from "../../../src/controller"
import { val, Core } from "../../../src"
import { id } from "./interceptor-identifier"

@id("FirstInterceptor")
export class FirstInterceptor implements Core.Middleware{
    execute(request:Core.HttpRequest, invocation:Core.Invocation) {
        return invocation.proceed()
    }
}