import { ActionResult, HttpRequest, HttpResponse, RouteInfo, Validator } from "../core"
import * as Xml from "xml"

export class ApiActionResult extends ActionResult {
    constructor(private request: HttpRequest, public body, public status: number) {
        super(undefined)
    }

    execute(response: HttpResponse, routeInfo: RouteInfo) {
        super.execute(response, routeInfo);
        if(this.status == 400)
        if (this.request.isAccept("text/xml")) {
            response.setContentType("text/xml")
            if (this.status) response.status(this.status)
            if (this.body) response.send(this.body)
        }
        else {
            if (this.status) response.status(this.status)
            if (this.body) response.json(this.body)
        }
    }
}