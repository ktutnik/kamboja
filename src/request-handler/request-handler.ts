import * as Core from "../core"
import { ValidatorImpl } from "../validator/validator"
import {ControllerInvocation} from "./controller-invocation"

export class RequestHandler {
    constructor(metaDataStorage: Core.MetaDataStorage,
        resolver: Core.DependencyResolver,
        validators: Array<Core.ValidatorCommand | string>,
        routeInfo: Core.RouteInfo,
        request: Core.HttpRequest,
        response: Core.HttpResponse) {
    }

    async execute() {
    }
}
