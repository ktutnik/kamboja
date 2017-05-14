import { HttpRequest, HttpResponse, ActionResult, RouteInfo, Cookie } from "../core"

export class JsonActionResult extends ActionResult {
    constructor(public body: any, public status?: number, cookies?: Cookie[]) {
        super(cookies)
    }

    async execute(request:HttpRequest, response: HttpResponse, routeInfo: RouteInfo) {
        super.execute(request, response, routeInfo)
        response.json(this.body, this.status || 200);
    }
}