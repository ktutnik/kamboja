import * as Chai from "chai"
import * as Helper from "../src/helper"

describe("Helper", () => {
    describe("getName", () => {
        it("Should return name properly", () => {
            let clean = Helper.getName("UserModel")
            Chai.expect(clean).eq("User")
        })

        it("Should case insensitive", () => {
            let clean = Helper.getName("usermodel")
            Chai.expect(clean).eq("user")
        })

        it("Should skip name without model", () => {
            let clean = Helper.getName("User")
            Chai.expect(clean).eq("User")
        })
    })

})