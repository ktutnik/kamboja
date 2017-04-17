import { autoConvert } from "../../src/parameter-binder/baseclasses"
import * as Transformer from "../../src/route-generator/transformers"
import * as Chai from "chai"
import * as H from "../helper"
import { DefaultPathResolver } from "../../src/resolver"


describe("Value Converter", () => {
    it("Should convert number properly", () => {
        Chai.expect(autoConvert("123")).eq(123)
        Chai.expect(autoConvert("-123")).eq(-123)
        Chai.expect(autoConvert("0.25")).eq(0.25)
    })

    it("Should convert boolean properly", () => {
        Chai.expect(autoConvert("True")).eq(true)
        Chai.expect(autoConvert("False")).eq(false)
        Chai.expect(autoConvert("true")).eq(true)
        Chai.expect(autoConvert("false")).eq(false)
    })

    it("Should return undefined if provided undefined", () => {
        Chai.expect(autoConvert(undefined)).undefined
    })

    it("Should convert string properly", () => {
        Chai.expect(autoConvert("name123")).eq("name123")
    })
})