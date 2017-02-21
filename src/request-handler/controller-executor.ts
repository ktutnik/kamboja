import * as Core from "../core"
import { Controller } from "../controller"
import { ParameterBinder } from "../parameter-binder"
import { ValidatorImpl } from "../validator"

export class ControllerExecutor implements Core.ExecutorCommand {
    private binder: ParameterBinder;
    constructor(private validator:ValidatorImpl,
        private resolver:Core.DependencyResolver,
        private routeInfo: Core.RouteInfo,
        private request: Core.HttpRequest) {
        this.binder = new ParameterBinder(routeInfo, request)
    }

    async execute() {
        let controller: Controller = this.resolver.resolve(this.routeInfo.classId)
        let parameters = this.binder.getParameters();
        this.validator.setValue(parameters, this.routeInfo.classMetaData, this.routeInfo.methodMetaData.name)
        controller.validator = this.validator;
        let method = <Function>controller[this.routeInfo.methodMetaData.name]
        let result = method.apply(controller, parameters);
        return <Promise<Core.ActionResult>>Promise.resolve(result);
    }
}