import {Controller, ApiController} from "../../../src/controller"

class NonExported extends Controller{
    getData(offset, pageSize){}
}

export class ExportedButNotInheritedController{
    getData(offset, pageSize){}
}

export class ValidController extends Controller{
    getData(offset, pageSize){}
}