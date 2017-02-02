import { internal, http } from "../../../src/core"
import { Controller, ApiController } from "../../../src/controller"

module MyModule {
    export class SimpleController extends Controller {
        @http.get("this/is/the/:nonPar/route")
        actionHaveNoParameter(par) { }
    }
}
