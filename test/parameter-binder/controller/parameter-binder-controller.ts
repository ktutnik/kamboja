import {Controller, ApiController} from "../../../src/controller"

export class DummyApi extends ApiController{
    myMethod(par1, par2){
    }
    noParam(){}

    list(offset, pageWidth){}
    modify(id, body){}
    add(body){}
}