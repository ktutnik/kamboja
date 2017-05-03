import { ActionResult, HttpRequest, HttpResponse, RouteInfo, Validator } from "../core"
import * as Xml from "xml"

export class ApiActionResult extends ActionResult {
    constructor(public body, public status?: number) {
        super(undefined)
    }

    execute(request:HttpRequest, response: HttpResponse, routeInfo: RouteInfo) {
        super.execute(request, response, routeInfo);
        if (request.isAccept("application/json")) this.sendJson(response)
        else if(request.isAccept("text/xml")) this.sendXml(response)
        else this.sendJson(response)
    }

    sendJson(response: HttpResponse) {
        response.status(this.status || 200)
        if (this.body) response.json(this.body)
        else response.end()
    }

    sendXml(response: HttpResponse) {
        response.setContentType("text/xml")
        response.status(this.status || 200)
        if (this.body) response.send(Xml(this.body))
        else response.end()
    }
}