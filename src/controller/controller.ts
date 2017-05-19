import { HttpRequest, HttpResponse, ActionResult, CookieOptions, Cookie, Validator, BaseController } from "../core"


export class Controller implements BaseController {
    request: HttpRequest
    validator: Validator
}

