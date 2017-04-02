import { Invocation, HttpRequest, HttpResponse } from "../core"

export class PageNotFoundInvocation extends Invocation {
    constructor(request: HttpRequest, private response: HttpResponse) {
        super()
        this.url = request.url;
        this.request = request
    }
    async execute() {
        this.response.status(404)
        this.response.end()
    }
}