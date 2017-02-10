import * as Core from "../core"
import { ApiControllerExecutor } from "./api-controller-executor"
import { ControllerExecutor } from "./controller-executor"


export class RequestHandler {
    private apiCommand: ApiControllerExecutor;
    private controllerCommand: ControllerExecutor;

    constructor(private facade:Core.Facade, 
        private routeInfo: Core.RouteInfo,
        request: Core.HttpRequest,
        private response: Core.HttpResponse) {
        this.apiCommand = new ApiControllerExecutor(facade, routeInfo, request)
        this.controllerCommand = new ControllerExecutor(facade, routeInfo, request)
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
