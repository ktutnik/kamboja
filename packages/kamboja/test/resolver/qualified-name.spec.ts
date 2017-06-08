import { Resolver } from "../../src"
import * as Chai from "chai"
import * as Path from "path"

describe("QualifiedName", () => {

    it("Should identify valid qualified name", () => {
        let test = new Resolver.QualifiedName("MyNameSpace.MyClass, ./module/class.js", new Resolver.DefaultPathResolver(__dirname))
        Chai.expect(test.isValid()).true
    })

    it("Should identify non valid qualified name", () => {
        let test = new Resolver.QualifiedName("MyNameSpace.MyClass ./module/class.js", new Resolver.DefaultPathResolver(__dirname))
        Chai.expect(test.isValid()).false
    })

    it("Should match with file start with ./", () => {
        let test = new Resolver.QualifiedName("MyNameSpace.MyClass, ./module/class.js", new Resolver.DefaultPathResolver(__dirname))
        Chai.expect(test.equals("MyNameSpace.MyClass, ./module/class")).true
        Chai.expect(test.className).eq("MyNameSpace.MyClass")
    })

    it("Should match with file without extension", () => {
        let test = new Resolver.QualifiedName("MyNameSpace.MyClass, ./module/class.js", new Resolver.DefaultPathResolver(__dirname))
        Chai.expect(test.equals("MyNameSpace.MyClass, module/class")).true
        Chai.expect(test.className).eq("MyNameSpace.MyClass")
    })

    it("Should ignore extra space", () => {
        let test = new Resolver.QualifiedName("MyNameSpace.MyClass, ./module/class.js", new Resolver.DefaultPathResolver(__dirname))
        Chai.expect(test.equals("MyNameSpace.MyClass , module/class")).true
        Chai.expect(test.className).eq("MyNameSpace.MyClass")
    })

    it("Should identify type with array", () => {
        let test = new Resolver.QualifiedName("MyNameSpace.MyClass[], ./module/class.js", new Resolver.DefaultPathResolver(__dirname))
        Chai.expect(test.isArray()).true
        Chai.expect(test.className).eq("MyNameSpace.MyClass")
    })

    /*
    it("Should work with windows file name", () => {
        let test = new Resolver.QualifiedName("MyNameSpace.MyClass, ./module/class.js")
        Chai.expect(test.equals("MyNameSpace.MyClass, module\\class.js")).true
        Chai.expect(test.className).eq("MyNameSpace.MyClass")
    })*/
})