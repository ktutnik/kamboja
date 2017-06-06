import { Invocation, HttpRequest, HttpResponse, ActionResult } from "../core"
import { HttpStatusError } from "../controller/errors"
import * as Url from "url"

export class PageNotFoundInvocation extends Invocation {
    constructor(request: HttpRequest,
        private response: HttpResponse) {
        super()
    }
    async proceed():Promise<ActionResult> {
        throw new HttpStatusError(404, "Requested url not found")
    }
}