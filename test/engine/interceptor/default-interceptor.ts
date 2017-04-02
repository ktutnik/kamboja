import { Controller } from "../../../src/controller"
import { val, Core} from "../../../src"
import { id } from "./interceptor-identifier"

@id("DefaultInterceptor")
export class DefaultInterceptor implements Core.RequestInterceptor{
    async intercept(invocation:Core.Invocation):Promise<void> {
        await invocation.execute()
    }
}