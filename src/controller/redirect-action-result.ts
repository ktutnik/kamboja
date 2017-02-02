import { HttpRequest, HttpResponse, ActionResult, RouteInfo } from "../core"

export class RedirectActionResult implements ActionResult{
    constructor(private url:string){}

    execute(response: HttpResponse, routeInfo: RouteInfo){
        return response.redirect(this.url);
    }
}