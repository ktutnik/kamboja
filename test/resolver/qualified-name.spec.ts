import { QualifiedName } from "../../src/resolver/qualified-name"
import * as Chai from "chai"

describe.only("QualifiedName", () => {
    it("Should parse file and class properly", () => {
        let test = new QualifiedName("MyNameSpace.MyClass, ./module/class.js")
        Chai.expect(test.className).eq("MyNameSpace.MyClass")
        Chai.expect(test.fileName).eq("module/class")
    })

    it("Should match with file start with or without extension", () => {
        let test = new QualifiedName("MyNameSpace.MyClass, ./module/class.js")
        Chai.expect(test.equals("MyNameSpace.MyClass, ./module/class")).true
        Chai.expect(test.equals("MyNameSpace.MyClass, module/class.js")).true
        Chai.expect(test.equals("MyNameSpace.MyClass, module/class")).true
        Chai.expect(test.equals("MyNameSpace.MyClass , module/class")).true
        Chai.expect(test.equals("MyNameSpace.MyClass, module\\class.js")).true
    })
})