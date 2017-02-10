import * as Core from "../core"
import { Controller } from "../controller"
import { ParameterBinder } from "../parameter-binder"
import { Validator } from "../validator"

export class ControllerExecutor implements Core.ExecutorCommand {
    private binder: ParameterBinder;
    constructor(private facade: Core.Facade,
        private routeInfo: Core.RouteInfo,
        private request: Core.HttpRequest) {
        this.binder = new ParameterBinder(routeInfo, request)
    }

    async execute() {
        let controller: Controller = this.facade.resolver.resolve(this.routeInfo.classId)
        let parameters = this.binder.getParameters();
        controller.validator = new Validator(parameters, this.routeInfo.methodMetaData, this.facade.metadataStorage, this.facade.validators)
        let method = <Function>controller[this.routeInfo.methodMetaData.name]
        let result = method.apply(controller, parameters);
        return <Promise<Core.ActionResult>>Promise.resolve(result);
    }
}