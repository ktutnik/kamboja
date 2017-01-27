import { ApiController, Controller, internal, http } from "../../../src/core"

export class SimpleController extends Controller {
    
    @http.get("this/is/the/first/route")
    @http.get("this/is/the/other/route")
    actionHaveNoParameter(){}

    @http.get("this/is/:parameter")
    @http.get("the/:parameter/in/the/middle")
    actionWithParameter(parameter){}
}