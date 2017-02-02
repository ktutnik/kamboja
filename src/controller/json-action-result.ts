import { HttpRequest, HttpResponse, ActionResult, RouteInfo } from "../core"

export class JsonActionResult implements ActionResult{
    constructor(public body:any, public status?:number){}

    execute(response: HttpResponse, routeInfo: RouteInfo){
        response.json(this.body, this.status);
    }
}