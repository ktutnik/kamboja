import { HttpRequest, HttpResponse, ActionResult } from "../core"

export class Controller {
    request: HttpRequest
    view(model?, viewName?: string): ActionResult {
        return new ViewActionResult(model, viewName);
    }
    
    redirect(url: string): ActionResult {
        return new RedirectActionResult(url);
    }

    file(path: string): ActionResult {
        return new FileActionResult(path);
    }
}

class ViewActionResult implements ActionResult{
    constructor(private model, private viewName:string){}

    execute(response:HttpResponse){
        return response.view(this.viewName, this.model);
    }
}

class RedirectActionResult implements ActionResult{
    constructor(private url:string){}

    execute(response:HttpResponse){
        return response.redirect(this.url);
    }
}

class FileActionResult implements ActionResult{
    constructor(private path:string){}

    execute(response:HttpResponse){
        return response.file(this.path);
    }
}