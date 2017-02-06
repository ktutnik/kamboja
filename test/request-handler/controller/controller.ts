import { Controller, ApiController } from "../../../src/controller"

export class DummyApi extends Controller {
    returnView() {
        return this.view({}, "index");
    }
    returnFile() {
        return this.file("/go/go/kamboja.js");
    }
    returnRedirect() {
        return this.redirect("/go/go/kamboja.js");
    }

    returnNonActionResult() {
        return "This is dumb"
    }

    setTheCookie() {
        this.setCookie("TheKey", "TheValue", { expires: true })
        return this.view()
    }

}