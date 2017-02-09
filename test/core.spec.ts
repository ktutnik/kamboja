import * as Chai from "chai"
import * as Core from "../src/core"
import * as H from "./helper"

describe("Core", () => {
    it("Instantiate HttpError properly", () => {
        let httpError = new Core.HttpError(null, null, null, null)
        Chai.expect(httpError).not.null;
    })

})