import { internal, http } from "../../../src/core"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends Controller {
    
    @http.get("route/got/:parameter")
    actionHaveNoParameter(){}

    @http.get("route/:associated/:notAssociated")
    postMethod(associated){}

    @http.get("route/have/no/parameter")
    actionHaveParameter(parameter){}
}