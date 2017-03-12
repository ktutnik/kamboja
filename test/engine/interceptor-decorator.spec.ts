import { getInterceptors, interceptor } from "../../src/engine/interceptor-decorator"
import * as Chai from "chai"

@interceptor("Interceptor, interceptor/path")
@interceptor("SecondInterceptor, interceptor/path")
class MyTargetClass {
    @interceptor("MethodInterceptor, interceptor/path")
    @interceptor("SecondMethodInterceptor, interceptor/path")
    theMethod() { }

    @interceptor("MethodInterceptor, interceptor/path")
    myProperty:string;
}

describe("Interceptor Decorator", () => {
    it("Should get class interceptors", () => {
        let target = new MyTargetClass();
        let result = getInterceptors(target);
        Chai.expect(result[0]).eq("SecondInterceptor, interceptor/path")
        Chai.expect(result[1]).eq("Interceptor, interceptor/path")
    })

    it("Should get method interceptors", () => {
        let target = new MyTargetClass();
        let result = getInterceptors(target, "theMethod");
        Chai.expect(result[0]).eq("SecondMethodInterceptor, interceptor/path")
        Chai.expect(result[1]).eq("MethodInterceptor, interceptor/path")
    })

    it("Should return empty array if provided null target", () => {
        let target = new MyTargetClass();
        let result = getInterceptors(null, "theMethod");
        Chai.expect(result.length).eq(0)
    })

    it("Should throw exception if used in property", () => {
        let target = new MyTargetClass();
        let result = getInterceptors(target, "theMethod");
        Chai.expect(result[0]).eq("SecondMethodInterceptor, interceptor/path")
        Chai.expect(result[1]).eq("MethodInterceptor, interceptor/path")
    })
})