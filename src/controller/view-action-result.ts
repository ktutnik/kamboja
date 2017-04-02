import { HttpRequest, HttpResponse, ActionResult, RouteInfo, Cookie } from "../core"

const ViewOutsideControllerError = "Relative view path can not be use inside Request Interceptor"

export class ViewActionResult extends ActionResult {
    constructor(public model, public viewName: string, cookies: Cookie[]) {
        super(cookies)
    }

    execute(response: HttpResponse, routeInfo: RouteInfo) {
        super.execute(response, routeInfo)
        //if view name doesn't contains / then add the classname
        if (this.viewName && this.viewName.indexOf("/") == -1) {
            if(!routeInfo) throw new Error(ViewOutsideControllerError);
            let className = this.getClassName(routeInfo.qualifiedClassName)
            let viewPath = className + "/" + this.viewName;
            response.view(viewPath, this.model);
        }
        else if (this.viewName)
            response.view(this.viewName, this.model);
        else {
            if(!routeInfo) throw new Error(ViewOutsideControllerError);
            let className = this.getClassName(routeInfo.qualifiedClassName)
            let viewPath = className + "/" + routeInfo.methodMetaData.name.toLowerCase()
            response.view(viewPath, this.model);
        }
    }

    private getClassName(fullQualifiedClassName: string) {
        let tokens = fullQualifiedClassName.split(",")
        let rawName = tokens[0].toLowerCase();
        let idx = rawName.lastIndexOf("controller");
        if (idx > 0)
            return rawName.substring(0, idx)
        return rawName;
    }
}