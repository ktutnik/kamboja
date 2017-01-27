import { ApiController, Controller, internal, http } from "../../../src/core"

export class SimpleController extends Controller {
    
    @http.get("this/get/got/different")
    getMethod(){}

    @http.post("this/post/got/different")
    postMethod(){}

    @http.put("this/put/got/different")
    putMethod(){}

    @http.delete("this/delete/got/different")
    deleteMethod(){}
}