import { internal, http } from "../../../src"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends ApiController {
    
    @http.get()
    getByPage(offset, pageWidth){}

}