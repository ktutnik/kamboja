import { Interceptor, interceptor } from "../../src"
import * as Chai from "chai"

@interceptor.add("Interceptor, interceptor/path")
@interceptor.add("SecondInterceptor, interceptor/path")
class MyTargetClass {
    @interceptor.add("MethodInterceptor, interceptor/path")
    @interceptor.add("SecondMethodInterceptor, interceptor/path")
    theMethod() { }

    @interceptor.add("MethodInterceptor, interceptor/path")
    myProperty:string;
}

describe("Interceptor Decorator", () => {
    it("Should get class interceptors", () => {
        let target = new MyTargetClass();
        let result = Interceptor.getInterceptors(target);
        Chai.expect(result[0]).eq("SecondInterceptor, interceptor/path")
        Chai.expect(result[1]).eq("Interceptor, interceptor/path")
    })

    it("Should get method interceptors", () => {
        let target = new MyTargetClass();
        let result = Interceptor.getInterceptors(target, "theMethod");
        Chai.expect(result[0]).eq("SecondMethodInterceptor, interceptor/path")
        Chai.expect(result[1]).eq("MethodInterceptor, interceptor/path")
    })

    it("Should return empty array if provided null target", () => {
        let target = new MyTargetClass();
        let result = Interceptor.getInterceptors(null, "theMethod");
        Chai.expect(result.length).eq(0)
    })

    it("Should throw exception if used in property", () => {
        let target = new MyTargetClass();
        let result = Interceptor.getInterceptors(target, "theMethod");
        Chai.expect(result[0]).eq("SecondMethodInterceptor, interceptor/path")
        Chai.expect(result[1]).eq("MethodInterceptor, interceptor/path")
    })
})