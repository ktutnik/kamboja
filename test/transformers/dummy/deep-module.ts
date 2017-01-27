import { ApiController, Controller } from "../../../src/core"

export module ParentModule {
    export class SimpleController extends Controller {
        myOtherGetAction(par1) { }
    }
    export module InnerModule {
        export class SimpleController extends Controller {
            myActionWithoutParameter() { }
        }
    }
}

