import { HttpRequest, HttpResponse, ActionResult } from "../core"

export class RedirectActionResult implements ActionResult{
    constructor(private url:string){}

    execute(response:HttpResponse){
        return response.redirect(this.url);
    }
}