import { HttpRequest, HttpResponse, ActionResult, CookieOptions, Cookie, Validator, BaseController } from "kamboja-core"


export class Controller implements BaseController {
    request: HttpRequest
    validator: Validator
}

