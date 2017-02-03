import { internal, http } from "../../../src/core"
import {Controller, ApiController} from "../../../src/controller"

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

