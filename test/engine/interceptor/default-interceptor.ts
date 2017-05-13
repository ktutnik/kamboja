import { Controller } from "../../../src/controller"
import { val, Core} from "../../../src"
import { id } from "./interceptor-identifier"

@id("DefaultInterceptor")
export class DefaultInterceptor implements Core.Middleware{
    async execute(request:Core.HttpRequest, invocation:Core.Invocation) {
        return await invocation.proceed()
    }
}