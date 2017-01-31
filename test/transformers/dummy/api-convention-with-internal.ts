import { internal, http } from "../../../src/core"
import {Controller, ApiController} from "../../../src/controller"

export class SimpleController extends ApiController {
    @internal()
    getByPage(offset, pageWidth){}

    get(id){}
}