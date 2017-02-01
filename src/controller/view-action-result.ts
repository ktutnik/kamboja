import { HttpRequest, HttpResponse, ActionResult, ActionResultParams } from "../core"

export class ViewActionResult implements ActionResult {
    constructor(private model, private viewName: string) { }

    execute(params: ActionResultParams) {
        //if viewname doesn't contains / then add the classname
        if(this.viewName && this.viewName.indexOf("/") == -1){
            let className = this.getClassName(params.routeInfo.className)
            let viewPath = className + "/" + this.viewName;
            params.response.view(viewPath, this.model);
        }
        else if (this.viewName)
            params.response.view(this.viewName, this.model);
        else {
            let className = this.getClassName(params.routeInfo.className)
            let viewPath = className + "/" + params.routeInfo.methodMetaData.name.toLowerCase()
            params.response.view(viewPath, this.model);
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