import { http } from "../../../src/core"
import { ApiController } from "../../../src/controller"


export class UserController extends ApiController {
    @http.get("this/is/dupe")
    getByPage(offset, take) { }
    @http.get("this/is/dupe")
    get() { }
}