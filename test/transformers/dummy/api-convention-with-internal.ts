import { ApiController, Controller, internal, http } from "../../../src/core"

export class SimpleController extends ApiController {
    @internal()
    getByPage(offset, pageWidth){}

    get(id){}
}