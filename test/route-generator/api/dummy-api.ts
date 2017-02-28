import {Controller, ApiController} from "../../../src/controller"

export class DummyApi extends ApiController{
    list(offset, pageSize){}
    get(id){}
    add(body)
    replace(id, body){}
    modify(id, body){}
    delete(id){}
}