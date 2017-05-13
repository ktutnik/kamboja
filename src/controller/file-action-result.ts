import { HttpRequest, HttpResponse, ActionResult, RouteInfo, Cookie } from "../core"

export class FileActionResult extends ActionResult{
    constructor(public filePath:string, cookies?:Cookie[]){
        super(cookies)
    }

    execute(request:HttpRequest, response: HttpResponse, routeInfo: RouteInfo){
        super.execute(request, response, routeInfo)
        response.file(this.filePath);
    }
}