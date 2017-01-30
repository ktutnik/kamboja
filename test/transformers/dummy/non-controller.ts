import { ApiController, Controller } from "../../../src/core"

class BaseClass {
    theMethod(){}
}

export class SimpleController extends BaseClass {
    myGetAction(par1, par2) { }
    myOtherGetAction(par1) { }
    myActionWithoutParameter() { }
}