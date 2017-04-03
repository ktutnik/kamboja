import { HttpRequest, HttpResponse, ActionResult, RouteInfo, Cookie } from "../core"

export class StatusActionResult extends ActionResult {
    constructor(public status: number, cookies: Cookie[]) {
        super(cookies)
    }

    execute(request:HttpRequest, response: HttpResponse, routeInfo: RouteInfo) {
        super.execute(request, response, routeInfo)
        response.status(this.status)
        response.end()
    }
}