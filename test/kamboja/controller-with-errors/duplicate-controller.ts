import {ApiController, http} from "../../../src/core"


export class UserController extends ApiController{
    @http.get("this/is/dupe")
    getByPage(offset, take){}
    @http.get("this/is/dupe")
    get(){}
}