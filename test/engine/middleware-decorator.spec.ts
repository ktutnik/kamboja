import { Middleware, middleware } from "../../src"
import * as Chai from "chai"

@middleware.add("Interceptor, interceptor/path")
@middleware.add("SecondInterceptor, interceptor/path")
class MyTargetClass {
    @middleware.add("MethodInterceptor, interceptor/path")
    @middleware.add("SecondMethodInterceptor, interceptor/path")
    theMethod() { }

    @middleware.add("MethodInterceptor, interceptor/path")
    myProperty:string;
}

describe("Interceptor Decorator", () => {
    it("Should get class interceptors", () => {
        let target = new MyTargetClass();
        let result = Middleware.getMiddlewares(target);
        Chai.expect(result[0]).eq("SecondInterceptor, interceptor/path")
        Chai.expect(result[1]).eq("Interceptor, interceptor/path")
    })

    it("Should get method interceptors", () => {
        let target = new MyTargetClass();
        let result = Middleware.getMiddlewares(target, "theMethod");
        Chai.expect(result[0]).eq("SecondMethodInterceptor, interceptor/path")
        Chai.expect(result[1]).eq("MethodInterceptor, interceptor/path")
    })

    it("Should return empty array if provided null target", () => {
        let target = new MyTargetClass();
        let result = Middleware.getMiddlewares(null, "theMethod");
        Chai.expect(result.length).eq(0)
    })

    it("Should throw exception if used in property", () => {
        let target = new MyTargetClass();
        let result = Middleware.getMiddlewares(target, "theMethod");
        Chai.expect(result[0]).eq("SecondMethodInterceptor, interceptor/path")
        Chai.expect(result[1]).eq("MethodInterceptor, interceptor/path")
    })
})