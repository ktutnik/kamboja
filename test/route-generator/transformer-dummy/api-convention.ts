import { internal, http } from "../../../src/core"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends ApiController {
    list(offset, pageWidth){}
    get(id){}
    add(data){}
    replace(id, data){}
    modify(id, data){}
    delete(id){}
}