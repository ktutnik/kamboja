import { internal, http } from "../../../src"
import { Controller, ApiController } from "../../../src/controller"

@http.root("/absolute/:none")
export class AbsoluteRootController extends Controller {
    @http.get("relative/:no")
    index(par1, par2) { }

    other(par1, par2) { }
}

@http.root("relative/:par2")
export class RelativeRootController extends Controller {
    @http.get("relative")
    index(par1, par2) { }
}