import { DefaultDependencyResolver} from "../../src/resolver/dependency-resolver"
import {DefaultIdentifierResolver} from "../../src/resolver/identifier-resolver"
import * as Chai from "chai"

describe("DependencyResolver", () => {
    it("Should load class properly", () => {
        let test = new DefaultDependencyResolver(new DefaultIdentifierResolver())
        let dummy = test.resolve<any>("Dummy, ./test/resolver/dummy/dummy")
        let data = dummy.getData();
        Chai.expect(data).eq(200)
    })

    it("Should load class with class extension", () => {
        let test = new DefaultDependencyResolver(new DefaultIdentifierResolver())
        let dummy = test.resolve<any>("Dummy, ./test/resolver/dummy/dummy.js")
        let data = dummy.getData();
        Chai.expect(data).eq(200)
    })

    it("Should load without ./", () => {
        let test = new DefaultDependencyResolver(new DefaultIdentifierResolver())
        let dummy = test.resolve<any>("Dummy, test/resolver/dummy/dummy")
        let data = dummy.getData();
        Chai.expect(data).eq(200)
    })

    it("Should load with /", () => {
        let test = new DefaultDependencyResolver(new DefaultIdentifierResolver())
        let dummy = test.resolve<any>("Dummy, /test/resolver/dummy/dummy")
        let data = dummy.getData();
        Chai.expect(data).eq(200)
    })

    it("Should load class with nested modules", () => {
        let test = new DefaultDependencyResolver(new DefaultIdentifierResolver())
        let dummy = test.resolve<any>("ParentModule.InnerModule.Dummy, ./test/resolver/dummy/dummy-with-module")
        let data = dummy.getData();
        Chai.expect(data).eq(200)
    })

    it("Should throw when provided non qualified class name", () => {
        let test = new DefaultDependencyResolver(new DefaultIdentifierResolver())
        Chai.expect(() => test.resolve<any>("Dummy")).throw(/not qualified/)
    })
})