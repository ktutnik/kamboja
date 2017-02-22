import * as Core from "../core"
import { Controller } from "../controller"
import { ParameterBinder } from "../parameter-binder"
import { ValidatorImpl } from "../validator"
import { ApiControllerExecutor } from "./api-controller-executor"
import { ControllerExecutor } from "./controller-executor"

export class Executor {
    constructor(private validator: ValidatorImpl,
        private resolver: Core.DependencyResolver,
        private routeInfo: Core.RouteInfo,
        private request: Core.HttpRequest,
        private response: Core.HttpResponse) {
    }

    async execute() {
        let apiCommand = new ApiControllerExecutor(this.validator, this.resolver, this.routeInfo, this.request)
        let controllerCommand = new ControllerExecutor(this.validator, this.resolver, this.routeInfo, this.request)
        try {
            let result: Core.ActionResult;
            switch (this.routeInfo.classMetaData.baseClass) {
                case "ApiController":
                    result = await apiCommand.execute();
                    break;
                default:
                    result = await controllerCommand.execute();
                    if (!result["execute"])
                        throw new Error(`[Kamboja] Error: Controller must return ActionResult on [${Core.getMethodName(this.routeInfo)}]`)
                    break;
            }
            result.execute(this.response, this.routeInfo)
        }
        catch (error) {
            this.response.error(error)
        }
    }
}