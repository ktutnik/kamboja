import { HttpRequest, HttpResponse, ActionResult, ActionResultParams } from "../core"

export class FileActionResult implements ActionResult{
    constructor(private path:string){}

    execute(params:ActionResultParams){
        return params.response.file(this.path);
    }
}