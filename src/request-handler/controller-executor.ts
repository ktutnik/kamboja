import * as Core from "../core"
import { ValidatorImpl } from "../validator"
import * as Kecubung from "kecubung"
import { ParameterBinder } from "../parameter-binder"
import { ApiActionResult } from "../controller/api-action-result"

export class ControllerExecutor {
    constructor(private controller: Core.BaseController,
        private routeInfo: Core.RouteInfo,
        private request: Core.HttpRequest) {
    }

    async execute(parameters: any[]) {
        this.controller.request = this.request;
        (<ValidatorImpl>this.controller.validator)
            .setValue(parameters, this.routeInfo.classMetaData, this.routeInfo.methodMetaData.name)
        let method = <Function>this.controller[this.routeInfo.methodMetaData.name]
        let result = method.apply(this.controller, parameters);
        if (this.routeInfo.classMetaData.baseClass == "Controller") {
            return <Promise<Core.ActionResult>>Promise.resolve(result);
        }
        else {
            //return immediately if VOID
            if (typeof result == "undefined" || result == null) return;
            //return if it is already ActionResult variant
            if (typeof result["execute"] == "function") return result
            let apiResult = await Promise.resolve(result)
            return new ApiActionResult(this.request, apiResult, 200)
        }
    }
}
