import * as Core from "../core"
import {BinderCommand, BinderResult, autoConvert} from "./baseclasses"

export class ApiConventionParameterBinder {
    constructor(private routeInfo: Core.RouteInfo, private request: Core.HttpRequest) { }

    getParameters(): BinderResult {
        if (this.routeInfo.initiator == "ApiConvention") {
            let routeParams = this.routeInfo.route
                .split("/")
                .filter(x => x.charAt(0) == ":")
                .map(x => x.substring(1))

            switch (this.routeInfo.httpMethod) {
                case "GET":
                case "DELETE":
                    return { status: "Next" };
                case "PUT":
                    let result = [];
                    result.push(autoConvert(this.request.getParam(routeParams[0])))
                    result.push(this.request.body)
                    return { status: "Exit", result: result };
                case "POST":
                    return { status: "Exit", result: [this.request.body] };
            }
        }
        else return { status: "Next" }
    }
}