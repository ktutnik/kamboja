import { HttpRequest, HttpResponse, ActionResult, BaseController, Validator } from "../core"
import { ApiActionResult } from "./api-action-result"

export class ApiController implements BaseController {
    request: HttpRequest
    validator: Validator

    /**
     * Send 200 (OK) to the client, if client accept XML xml response will be sent,
     * except JSON result will be sent. 
     */
    ok(body){
        return new ApiActionResult(this.request, body, 200)
    }

    /**
     * Send 400 (Invalid Request), use this method if payload sent by user doesn't 
     * pass validation. 
     * @param body: message will be sent to the client, if null/undefined validation message will be sent
     */
    invalid(body?){
        return new ApiActionResult(this.request, body || this.validator.getValidationErrors(), 400)
    }
}
