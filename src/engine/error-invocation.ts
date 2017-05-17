import { Invocation, HttpRequest, HttpResponse, KambojaOption, ActionResult, RouteInfo } from "../core"
import { StatusActionResult } from "../controller/status-action-result"
import * as Url from "url"

export class ErrorInvocation extends Invocation {
    constructor(request: HttpRequest, private response: HttpResponse, private error, routes: RouteInfo[]) {
        super()
        let routeInfo = routes.filter(x => x.route == request.route)[0]
        if (routeInfo) {
            this.controllerInfo = {
                classId: routeInfo.classId,
                classMetaData: routeInfo.classMetaData,
                methodMetaData: routeInfo.methodMetaData,
                qualifiedClassName: routeInfo.qualifiedClassName
            }
        }
    }
    
    async proceed(): Promise<ActionResult> {
        throw this.error
    }
}