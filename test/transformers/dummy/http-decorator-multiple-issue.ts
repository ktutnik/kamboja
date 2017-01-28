import { ApiController, Controller, internal, http } from "../../../src/core"

export class SimpleController extends Controller {
    
    @http.get("this/is/the/first/route/:nonPar")
    @http.get("this/is/the/:nonPar/route")
    actionHaveNoParameter(par){}

}