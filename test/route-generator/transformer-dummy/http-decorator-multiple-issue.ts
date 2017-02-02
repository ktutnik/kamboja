import { internal, http } from "../../../src/core"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends Controller {
    
    @http.get("this/is/the/first/route/:nonPar")
    @http.get("this/is/the/:nonPar/route")
    actionHaveNoParameter(par){}

}