import { ApiController, Controller } from "../../../src/core"

export module ParentModule {
    export class SimpleController extends Controller {
        myOtherGetAction(par1) { }
    }
    //this module is not exported
    module InnerModule {
        export class SimpleController extends Controller {
            myActionWithoutParameter() { }
        }
    }
}

