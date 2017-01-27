import { ApiController, Controller, internal, http } from "../../../src/core"

export class SimpleController extends Controller {
    
    //conflict decorators 
    @internal()
    @http.get()
    privateMethod(par1, par2) { }

    publicMethod(par1) { }
}