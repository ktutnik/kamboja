

import * as Core from "../../../src/core"

class NonExprotedController extends Core.ApiController{
    myMethod(){}
}

export class ExportedButNotInheritedFromController {
    myMethod(par1){}
}