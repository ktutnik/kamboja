import { Invocation, HttpRequest, HttpResponse, KambojaOption } from "../core"
import { StatusActionResult } from "../controller/status-action-result"
import * as Url from "url"

export class PageNotFoundInvocation extends Invocation {
    constructor(request: HttpRequest,
        private response: HttpResponse) {
        super()
        this.url = request.url;
        this.request = request
    }
    async execute() {
        return new StatusActionResult(404, "Requested url not found")
    }
}