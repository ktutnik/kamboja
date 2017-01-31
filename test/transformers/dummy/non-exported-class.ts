import { internal, http } from "../../../src/core"
import {Controller, ApiController} from "../../../src/controller"

//this class is not exported
class NonExportedController extends Controller {
    myGetAction(par1, par2) { }
}

export class SimpleController extends Controller {
    myOtherGetAction(par1) { }
}