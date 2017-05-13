import { Core, ApiActionResult, ViewActionResult } from "../index"

export class ErrorHandler {
    constructor(private error, private option: Core.KambojaOption, 
        private request:Core.HttpRequest, 
        private response:Core.HttpResponse) { }

    execute() {
        if(this.option.errorHandler){
            this.option.errorHandler(new Core.HttpError(this.error.status, this.error, this.request, this.response))
        }
        else{
            let routeInfo = <Core.RouteInfo>this.error.routeInfo;
            if(routeInfo && routeInfo.classMetaData.baseClass == "ApiController"){
                let actionResult = new ApiActionResult(this.error.message, this.error.status)
                actionResult.execute(this.request, this.response, routeInfo)
            }
            else {
                this.response.status(this.error.status)
                this.response.view("error", {})
            }
        }
    }
}