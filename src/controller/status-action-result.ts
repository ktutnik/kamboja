import { HttpRequest, HttpResponse, ActionResult, RouteInfo, Cookie } from "../core"

export class StatusActionResult extends ActionResult {
    constructor(public status: number, public message?:string) {
        super(undefined)
    }

    async execute(request:HttpRequest, response: HttpResponse, routeInfo: RouteInfo) {
        super.execute(request, response, routeInfo)
        response.status(this.status)
        response.send(this.message)
    }
}