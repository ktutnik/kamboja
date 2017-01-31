import { HttpRequest, HttpResponse, ActionResult } from "../core"
import { FileActionResult } from "./file-action-result"
import { RedirectActionResult } from "./redirect-action-result"
import { ViewActionResult } from "./view-action-result"

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

