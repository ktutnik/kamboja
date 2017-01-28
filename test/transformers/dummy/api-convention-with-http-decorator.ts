import { ApiController, Controller, internal, http } from "../../../src/core"

export class SimpleController extends ApiController {
    
    @http.get()
    getByPage(offset, pageWidth){}

}