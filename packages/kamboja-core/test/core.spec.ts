import * as Chai from "chai"
import * as Core from "../src"

describe("Core", () => {
    it("Instantiate HttpError properly", () => {
        let httpError = new Core.HttpError(null, null, null, null)
        Chai.expect(httpError).not.null;
    })
})