import { internal, http } from "../../../src"
import { Controller, ApiController } from "../../../src/controller"

module MyModule {
    export class SimpleController extends Controller {
        @http.get("this/is/the/:nonPar/route")
        actionHaveNoParameter(par) { }
    }
}
