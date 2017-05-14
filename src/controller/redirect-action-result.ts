import { HttpRequest, HttpResponse, ActionResult, RouteInfo, Cookie } from "../core"

export class RedirectActionResult extends ActionResult{
    constructor(public redirectUrl:string, cookies?:Cookie[]){
        super(cookies)
    }

    async execute(request:HttpRequest, response: HttpResponse, routeInfo: RouteInfo){
        super.execute(request, response, routeInfo)
        response.redirect(this.redirectUrl);
    }
}