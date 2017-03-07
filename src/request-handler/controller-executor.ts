import * as Core from "../core"
import { ValidatorImpl } from "../validator"
import * as Kecubung from "kecubung"
import { ParameterBinder } from "../parameter-binder"
import { ApiActionResult } from "../controller/api-action-result"
import { Factory } from "./factory"

export class ControllerExecutor {
    constructor(private factory: Factory,
        private request: Core.HttpRequest) {
    }

    async execute(parameters: any[]) {
        let controller = this.factory.createController();
        controller.validator = this.factory.createValidatorForValue(parameters)
        controller.request = this.request;
        let method = <Function>controller[this.factory.routeInfo.methodMetaData.name]
        if (this.factory.routeInfo.classMetaData.baseClass == "Controller") {
            let result = method.apply(controller, parameters);
            return <Promise<Core.ActionResult>>Promise.resolve(result);
        }
        else {
            if (this.factory.facade.autoValidation && !controller.validator.isValid()) {
                return new ApiActionResult(this.request, controller.validator.getValidationErrors(), 400)
            }
            let result = method.apply(controller, parameters);
            //return immediately if VOID
            if (typeof result == "undefined" || result == null) return;
            //return if it is already ActionResult variant
            if (typeof result["execute"] == "function") return result
            let apiResult = await Promise.resolve(result)
            return new ApiActionResult(this.request, apiResult, 200)
        }
    }
}
