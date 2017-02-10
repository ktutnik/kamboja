import { HttpRequest, HttpResponse, ActionResult, BaseController, Validator } from "../core"

export class ApiController implements BaseController {
    request: HttpRequest
    validator: Validator
}