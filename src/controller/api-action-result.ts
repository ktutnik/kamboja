import { ActionResult, HttpRequest, HttpResponse, RouteInfo, Validator } from "../core"
import * as Xml from "xml"

export class ApiActionResult extends ActionResult {
    constructor(body, status?: number) {
        super(body, status)
    }

    async execute(request: HttpRequest, response: HttpResponse, routeInfo: RouteInfo) {
        this.type = "application/json"
        if (request.isAccept("text/xml")) {
            this.type = "text/xml"
            this.body = Xml(this.body)
        }
        super.execute(request, response, routeInfo);
    }
}