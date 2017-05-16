import * as Chai from "chai"
import { HttpStatusError } from "../../src/controller/errors"

describe("HttpStatusError", () => {
    it("Should instantiate properly", ()=> {
        let error = new HttpStatusError(400, "Fatal Error")
        Chai.expect(error.status).eq(400)
        Chai.expect(error.message).eq("Fatal Error")
    })

    it("Should be instance of Error", ()=> {
        let error = new HttpStatusError(400, "Fatal Error")
        Chai.expect(error instanceof Error).true;
    })

    it("Should be instance of itself", ()=> {
        let error = new HttpStatusError(400, "Fatal Error")
        Chai.expect(error instanceof HttpStatusError).true;
    })
})