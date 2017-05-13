import { Core, ApiActionResult, ViewActionResult } from "../index"
import * as Xml from "xml"

export class ErrorHandler {
    constructor(private error, private option: Core.KambojaOption,
        private request: Core.HttpRequest,
        private response: Core.HttpResponse) { }

    execute() {
        if (this.option.errorHandler) {
            this.option.errorHandler(new Core.HttpError(this.error.status, this.error, this.request, this.response))
        }
        else {
            let routeInfo = <Core.RouteInfo>this.error.routeInfo;
            if (routeInfo && routeInfo.classMetaData.baseClass == "ApiController") {
                let actionResult = new ApiActionResult(this.error.message, this.error.status)
                actionResult.execute(this.request, this.response, routeInfo)
            }
            else if (this.request.getHeader("Content-Type") == "application/json") {
                let actionResult = new ApiActionResult(this.error.message, this.error.status)
                actionResult.execute(this.request, this.response, routeInfo)
            }
            else if (this.request.getHeader("Content-Type") == "text/xml") {
                this.response.setContentType("text/xml")
                this.response.status(this.error.status)
                this.response.send(Xml(this.error.message))
                this.response.end()
            }
            else {
                this.response.status(this.error.status)
                this.response.view("error", {})
            }
        }
    }

}