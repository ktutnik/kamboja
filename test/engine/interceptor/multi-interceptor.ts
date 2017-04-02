import { Controller } from "../../../src/controller"
import { val, Core } from "../../../src"
import { id } from "./interceptor-identifier"

@id("FirstInterceptor")
export class FirstInterceptor implements Core.RequestInterceptor{
    async intercept(invocation:Core.Invocation):Promise<void> {
        await invocation.execute()
    }
}