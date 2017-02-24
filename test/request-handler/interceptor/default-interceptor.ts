import { Controller } from "../../../src/controller"
import { interceptor } from "../../../src/request-handler/interceptor-decorator"
import { val, decoratorName, Interceptor, Invocation } from "../../../src"
import { id } from "./interceptor-identifier"

@id("DefaultInterceptor")
export class DefaultInterceptor implements Interceptor{
    async intercept(invocation:Invocation):Promise<void> {
        await invocation.execute()
    }
}