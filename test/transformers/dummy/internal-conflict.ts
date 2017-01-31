import { internal, http } from "../../../src/core"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends Controller {
    
    //conflict decorators 
    @internal()
    @http.get()
    privateMethod(par1, par2) { }

    publicMethod(par1) { }
}