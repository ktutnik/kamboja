import { HttpRequest, HttpResponse, ActionResult, ActionResultParams } from "../core"

export class RedirectActionResult implements ActionResult{
    constructor(private url:string){}

    execute(params:ActionResultParams){
        return params.response.redirect(this.url);
    }
}