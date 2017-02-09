import * as Core from "../core"
import { ParameterBinder } from "../parameter-binder"
import { JsonActionResult, ApiController } from "../controller"
import { Validator } from "../validator"

export class ApiControllerExecutor implements Core.ExecutorCommand {
    private binder: ParameterBinder;
    constructor(private routeInfo: Core.RouteInfo,
        private resolver: Core.DependencyResolver,
        private idResolver:Core.IdentifierResolver,
        private request: Core.HttpRequest) {
        this.binder = new ParameterBinder(routeInfo, request)
    }

    async execute() {
        let controller: ApiController = this.resolver.resolve(this.routeInfo.classId)
        let parameters = this.binder.getParameters();
        controller.validator = new Validator(parameters, this.routeInfo.methodMetaData, this.idResolver)
        let method = <Function>controller[this.routeInfo.methodMetaData.name]
        let methodResult = method.apply(controller, parameters);
        let result = await Promise.resolve(methodResult);
        return new JsonActionResult(result, undefined, undefined);
    }
}