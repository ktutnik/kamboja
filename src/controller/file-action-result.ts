import { HttpRequest, HttpResponse, ActionResult, RouteInfo, Cookie } from "../core"

export class FileActionResult extends ActionResult{
    constructor(public filePath:string, public cookies:Cookie[]){
        super(cookies)
    }

    execute(response: HttpResponse, routeInfo: RouteInfo){
        super.execute(response, routeInfo)
        response.file(this.filePath);
    }
}