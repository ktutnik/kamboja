import { Invocation, HttpRequest, HttpResponse, KambojaOption, ActionResult } from "../core"
import { StatusActionResult } from "../controller/status-action-result"
import * as Url from "url"

export class ErrorInvocation extends Invocation {
    constructor(request: HttpRequest, private response: HttpResponse, private error) {
        super()
    }
    async proceed():Promise<ActionResult> {
        throw this.error
    }
}