import { getInterceptors, interceptor } from "../../src/request-handler/interceptor-decorator"
import * as Chai from "chai"

@interceptor("Interceptor, interceptor/path")
@interceptor("SecondInterceptor, interceptor/path")
class MyTargetClass {
    @interceptor("MethodInterceptor, interceptor/path")
    @interceptor("SecondMethodInterceptor, interceptor/path")
    theMethod() { }
}

describe.only("Interceptor Decorator", () => {
    it("Should get class interceptors", () => {
        let target = new MyTargetClass();
        let result = getInterceptors(target);
        console.log(result)
        Chai.expect(result[0]).eq("Interceptor, interceptor/path")
        Chai.expect(result[1]).eq("SecondInterceptor, interceptor/path")
    })

    it("Should get method interceptors", () => {
        let target = new MyTargetClass();
        let result = getInterceptors(target, "theMethod");
        console.log(result)
        Chai.expect(result[0]).eq("MethodInterceptor, interceptor/path")
        Chai.expect(result[1]).eq("SecondMethodInterceptor, interceptor/path")
    })
})