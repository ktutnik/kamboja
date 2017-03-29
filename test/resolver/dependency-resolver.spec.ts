import { DefaultDependencyResolver} from "../../src/resolver/dependency-resolver"
import {DefaultIdentifierResolver} from "../../src/resolver/identifier-resolver"
import {DefaultPathResolver} from "../../src/resolver/path-resolver"
import * as Chai from "chai"

describe("DependencyResolver", () => {
    
    it("Should load class properly", () => {
        let test = new DefaultDependencyResolver(new DefaultIdentifierResolver(), new DefaultPathResolver(__dirname))
        let dummy = test.resolve<any>("Dummy, ./dummy/dummy")
        let data = dummy.getData();
        Chai.expect(data).eq(200)
    })

    it("Should load class with class extension", () => {
        let test = new DefaultDependencyResolver(new DefaultIdentifierResolver(), new DefaultPathResolver(__dirname))
        let dummy = test.resolve<any>("Dummy, ./dummy/dummy.js")
        let data = dummy.getData();
        Chai.expect(data).eq(200)
    })

    it("Should load without ./", () => {
        let test = new DefaultDependencyResolver(new DefaultIdentifierResolver(), new DefaultPathResolver(__dirname))
        let dummy = test.resolve<any>("Dummy, dummy/dummy")
        let data = dummy.getData();
        Chai.expect(data).eq(200)
    })

    it("Should load class with nested modules", () => {
        let test = new DefaultDependencyResolver(new DefaultIdentifierResolver(), new DefaultPathResolver(__dirname))
        let dummy = test.resolve<any>("ParentModule.InnerModule.Dummy, ./dummy/dummy-with-module")
        let data = dummy.getData();
        Chai.expect(data).eq(200)
    })
})