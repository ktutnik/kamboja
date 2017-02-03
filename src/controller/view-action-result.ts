import { HttpRequest, HttpResponse, ActionResult, RouteInfo } from "../core"

export class ViewActionResult implements ActionResult {
    constructor(public model, public viewName: string) { }

    execute(response: HttpResponse, routeInfo: RouteInfo) {
        //if viewname doesn't contains / then add the classname
        if(this.viewName && this.viewName.indexOf("/") == -1){
            let className = this.getClassName(routeInfo.qualifiedClassName)
            let viewPath = className + "/" + this.viewName;
            response.view(viewPath, this.model);
        }
        else if (this.viewName)
            response.view(this.viewName, this.model);
        else {
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