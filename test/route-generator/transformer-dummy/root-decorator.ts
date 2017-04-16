import { internal, http } from "../../../src"
import { Controller, ApiController } from "../../../src/controller"



export namespace Namespace {
    @http.root("/absolute")
    export class AbsoluteRootController extends Controller {
        @http.get("relative")
        index(par1, par2) { }
        @http.get("/abs/url")
        myGetAction(par1, par2) { }
    }

    @http.root("relative")
    export class RelativeRootController extends Controller {
        @http.get("relative")
        index(par1, par2) { }
        @http.get("/absolute/url")
        myGetAction(par1, par2) { }
    }
}