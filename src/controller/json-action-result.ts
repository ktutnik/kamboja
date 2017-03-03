import { HttpRequest, HttpResponse, ActionResult, RouteInfo, Cookie } from "../core"

export class JsonActionResult extends ActionResult {
    constructor(public body: any, public status: number, cookies: Cookie[]) {
        super(cookies)
    }

    execute(response: HttpResponse, routeInfo: RouteInfo) {
        super.execute(response, routeInfo)
        response.json(this.body, this.status);
    }
}