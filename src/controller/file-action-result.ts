import { HttpRequest, HttpResponse, ActionResult, RouteInfo } from "../core"

export class FileActionResult implements ActionResult{
    constructor(public filePath:string){}

    execute(response: HttpResponse, routeInfo: RouteInfo){
        response.file(this.filePath);
    }
}