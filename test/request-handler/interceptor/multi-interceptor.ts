import { Controller } from "../../../src/controller"
import { interceptor } from "../../../src/engine/interceptor-decorator"
import { val, Core } from "../../../src"
import { id } from "./interceptor-identifier"

@id("FirstInterceptor")
export class FirstInterceptor implements Core.Interceptor{
    async intercept(invocation:Core.Invocation):Promise<void> {
        await invocation.execute()
    }
}