import * as Core from "../core"
import { ApiControllerExecutor } from "./api-controller-executor"
import { ControllerExecutor } from "./controller-executor"
import { Validator } from "../validator/validator"



export class RequestHandler {
    private apiCommand: ApiControllerExecutor;
    private controllerCommand: ControllerExecutor;

    constructor(private metaDataStorage: Core.MetaDataStorage,
        private resolver: Core.DependencyResolver,
        private validators: Array<Core.ValidatorCommand | string>,
        private routeInfo: Core.RouteInfo,
        request: Core.HttpRequest,
        private response: Core.HttpResponse) {
        let commands: Core.ValidatorCommand[] = [];
        if (validators) {
            validators.forEach(x => {
                if (typeof x == "string") {
                    let validator = resolver.resolve(x)
                    commands.push(validator)
                }
                else commands.push(x)
            })
        }
        let validator = new Validator(metaDataStorage, commands)
        this.apiCommand = new ApiControllerExecutor(validator, resolver, routeInfo, request)
        this.controllerCommand = new ControllerExecutor(validator, resolver, routeInfo, request)
    }

    async execute() {
        try {
            let result: Core.ActionResult;
            switch (this.routeInfo.classMetaData.baseClass) {
                case "ApiController":
                    result = await this.apiCommand.execute();
                    break;
                default:
                    result = await this.controllerCommand.execute();
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
