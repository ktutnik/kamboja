import { ApiController, Controller, internal, http } from "../../../src/core"

export class SimpleController extends Controller {
    
    @internal()
    privateMethod(par1, par2) { }

    publicMethod(par1) { }
}