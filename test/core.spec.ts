import * as Chai from "chai"
import * as Core from "../src/core"
import * as H from "./helper"
import {HttpRequest} from "../src/test"

describe("Core", () => {
    it("Instantiate HttpError properly", () => {
        let httpError = new Core.HttpError(null, null, null, null)
        Chai.expect(httpError).not.null;
    })

    it("Should instantiate HttpRequest properly", () => {
        let request = new HttpRequest();
        request.getCookie("")
        request.getHeader("")
        request.getParam("")
        request.getUserRole()
        request.isAccept("")
        request.isAuthenticated()
    })

})