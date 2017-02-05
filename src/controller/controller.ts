import { HttpRequest, HttpResponse, ActionResult, CookieOptions, Cookie } from "../core"
import { FileActionResult } from "./file-action-result"
import { RedirectActionResult } from "./redirect-action-result"
import { ViewActionResult } from "./view-action-result"
import { JsonActionResult } from "./json-action-result"


export class Controller {
    request: HttpRequest
    cookies: Cookie[] = []

    setCookie(key: string, value: string, option?: CookieOptions) {
        this.cookies.push({ key: key, value: value, options: option })
    }

    view(model?, viewName?: string): ActionResult {
        return new ViewActionResult(model, viewName, this.cookies);
    }

    redirect(url: string): ActionResult {
        return new RedirectActionResult(url, this.cookies);
    }

    file(path: string): ActionResult {
        return new FileActionResult(path, this.cookies);
    }

    json(body, status?: number): ActionResult {
        return new JsonActionResult(body, status, this.cookies);
    }
}

