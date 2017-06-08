import { internal, http } from "../../../src"
import {Controller, ApiController} from "../../../src/controller"

class BaseClass {
    theMethod(){}
}

export class SimpleController extends BaseClass {
    myGetAction(par1, par2) { }
    myOtherGetAction(par1) { }
    myActionWithoutParameter() { }
}