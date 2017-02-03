import { HttpRequest, HttpResponse, ActionResult, RouteInfo } from "../core"

export class RedirectActionResult implements ActionResult{
    constructor(public redirectUrl:string){}

    execute(response: HttpResponse, routeInfo: RouteInfo){
        response.redirect(this.redirectUrl);
    }
}