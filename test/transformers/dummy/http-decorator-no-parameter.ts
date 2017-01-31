import { internal, http } from "../../../src/core"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends Controller {
    
    @http.get()
    getMethod(){}

    @http.post()
    postMethod(params){}

    @http.put()
    putMethod(){}

    @http.delete()
    deleteMethod(){}
}