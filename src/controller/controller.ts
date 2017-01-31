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
    constructor(model, viewName:string){}

    execute(response:HttpResponse):Promise<void>{
        return ;
    }
}

class RedirectActionResult implements ActionResult{
    constructor(url:string){}

    execute(response:HttpResponse):Promise<void>{
        return ;
    }
}

class FileActionResult implements ActionResult{
    constructor(path:string){}

    execute(response:HttpResponse):Promise<void>{
        return ;
    }
}