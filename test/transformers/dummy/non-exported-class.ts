import { ApiController, Controller } from "../../../src/core"

//this class is not exported
class NonExportedController extends Controller {
    myGetAction(par1, par2) { }
}

export class SimpleController extends Controller {
    myOtherGetAction(par1) { }
}