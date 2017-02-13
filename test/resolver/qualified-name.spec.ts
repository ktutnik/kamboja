import { QualifiedName } from "../../src/resolver/qualified-name"
import * as Chai from "chai"
import * as Path from "path"

describe("QualifiedName", () => {
    it("Should match with file start with ./", () => {
        let test = new QualifiedName("MyNameSpace.MyClass, ./module/class.js")
        Chai.expect(test.equals("MyNameSpace.MyClass, ./module/class")).true
        Chai.expect(test.className).eq("MyNameSpace.MyClass")
    })

    it("Should match with file without extension", () => {
        let test = new QualifiedName("MyNameSpace.MyClass, ./module/class.js")
        Chai.expect(test.equals("MyNameSpace.MyClass, module/class")).true
        Chai.expect(test.className).eq("MyNameSpace.MyClass")
    })

    it("Should ignore extra space", () => {
        let test = new QualifiedName("MyNameSpace.MyClass, ./module/class.js")
        Chai.expect(test.equals("MyNameSpace.MyClass , module/class")).true
        Chai.expect(test.className).eq("MyNameSpace.MyClass")
    })

    it("Should work with windows file name", () => {
        let test = new QualifiedName("MyNameSpace.MyClass, ./module/class.js")
        Chai.expect(test.equals("MyNameSpace.MyClass, module\\class.js")).true
        Chai.expect(test.className).eq("MyNameSpace.MyClass")
    })
})