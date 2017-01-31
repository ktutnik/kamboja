import { HttpRequest, HttpResponse, ActionResult } from "../core"

export class ViewActionResult implements ActionResult{
    constructor(private model, private viewName:string){}

    execute(response:HttpResponse){
        return response.view(this.viewName, this.model);
    }
}