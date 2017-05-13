import * as Core from "../core"
import { ValidatorImpl } from "../validator"
import * as Kecubung from "kecubung"
import { ParameterBinder } from "../parameter-binder"
import { ApiActionResult } from "../controller/api-action-result"
import { ControllerFactory } from "./factory"

export class ControllerExecutor {
    constructor(private factory: ControllerFactory,
        private request: Core.HttpRequest) {
    }

    async execute(parameters: any[]) {
        let controller = this.factory.createController();
        controller.validator = this.factory.createValidatorForValue(parameters)
        controller.request = this.request;
        let method = <Function>controller[this.factory.routeInfo.methodMetaData.name]
        if (this.factory.routeInfo.classMetaData.baseClass == "ApiController" &&
            this.factory.facade.autoValidation && !controller.validator.isValid()) {
            let result = method.apply(controller, parameters);
            return new ApiActionResult(controller.validator.getValidationErrors(), 400)
        }
        return method.apply(controller, parameters);
    }
}
