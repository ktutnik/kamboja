import * as Utils from "../src/module-utils"
import * as Chai from "chai"

describe("Module Utils", () => {
    describe("getInstance", () => {

        it("Should load class properly", () => {
            let dummy = Utils.getInstance<any>("Dummy, ./test/dummy/module-utils/dummy")
            let data = dummy.getData();
            Chai.expect(data).eq(200)
        })

        it("Should load class with class extension", () => {
            let dummy = Utils.getInstance<any>("Dummy, ./test/dummy/module-utils/dummy.js")
            let data = dummy.getData();
            Chai.expect(data).eq(200)
        })

        it("Should load without ./", () => {
            let dummy = Utils.getInstance<any>("Dummy, test/dummy/module-utils/dummy")
            let data = dummy.getData();
            Chai.expect(data).eq(200)
        })

        it("Should load with /", () => {
            let dummy = Utils.getInstance<any>("Dummy, /test/dummy/module-utils/dummy")
            let data = dummy.getData();
            Chai.expect(data).eq(200)
        })

        it("Should load class with nested modules", () => {
            let dummy = Utils.getInstance<any>("ParentModule.InnerModule.Dummy, ./test/dummy/module-utils/dummy-with-module")
            let data = dummy.getData();
            Chai.expect(data).eq(200)
        })

        it("Should throw when provided non qualified class name", () => {
            Chai.expect(() => Utils.getInstance<any>("Dummy")).throw(/not qualified/)
        })
    })
})