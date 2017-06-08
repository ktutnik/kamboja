import { HttpRequest, HttpResponse, ActionResult, BaseController, Validator } from "kamboja-core"
import { ApiActionResult } from "./api-action-result"

export class ApiController implements BaseController {
    request: HttpRequest
    validator: Validator
}
