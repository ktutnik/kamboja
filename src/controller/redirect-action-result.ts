import { HttpRequest, HttpResponse, ActionResult, RouteInfo, Cookie } from "../core"

export class RedirectActionResult extends ActionResult{
    constructor(public redirectUrl:string, public cookies:Cookie[]){
        super(cookies)
    }

    execute(response: HttpResponse, routeInfo: RouteInfo){
        super.execute(response, routeInfo)
        response.redirect(this.redirectUrl);
    }
}