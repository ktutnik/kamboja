import { HttpRequest, HttpResponse, ActionResult } from "../core"

export class FileActionResult implements ActionResult{
    constructor(private path:string){}

    execute(response:HttpResponse){
        return response.file(this.path);
    }
}