import { HttpRequest, HttpResponse, ActionResult, RouteInfo } from "../core"

export class FileActionResult implements ActionResult{
    constructor(private path:string){}

    execute(response: HttpResponse, routeInfo: RouteInfo){
        return response.file(this.path);
    }
}