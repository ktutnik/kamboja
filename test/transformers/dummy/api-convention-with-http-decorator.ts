import { internal, http } from "../../../src/core"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends ApiController {
    
    @http.get()
    getByPage(offset, pageWidth){}

}