import { ApiController, Controller, internal, http } from "../../../src/core"

export class SimpleController extends Controller {
    
    @http.get()
    getMethod(){}

    @http.post()
    postMethod(){}

    @http.put()
    putMethod(){}

    @http.delete()
    deleteMethod(){}
}