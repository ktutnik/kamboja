import * as Chai from "chai"
import * as Core from "../src/core"

describe("Core", () => {
    it("Instantiate validator properly", () => {
        let validator = new Core.Validator()
        validator.string(false, 20)
        Chai.expect(validator).not.null;
    })

    it("Instantiate validator with default properly", () => {
        let validator = new Core.Validator()
        validator.string()
        Chai.expect(validator).not.null;
    })

    it("Instantiate HttpError properly", () => {
        let httpError = new Core.HttpError(null, null, null, null)
        Chai.expect(httpError).not.null;
    })
})