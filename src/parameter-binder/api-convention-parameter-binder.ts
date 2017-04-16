import * as Core from "../core"
import { BinderCommand, BinderResult, autoConvert } from "./baseclasses"
import { MethodConventionType } from "../route-generator"

export class ApiConventionParameterBinder {
    constructor(private routeInfo: Core.RouteInfo, private request: Core.HttpRequest) { }

    getParameters(): BinderResult {
        if (this.routeInfo.initiator == "ApiConvention") {
            let parameters = this.routeInfo.methodMetaData.parameters;
            switch (this.routeInfo.httpMethod) {
                case "GET":
                case "DELETE":
                    return { status: "Next" };
                case "PATCH":
                case "PUT":
                    let result = [];
                    let id = parameters[0].name
                    result.push(autoConvert(this.request.getParam(id)))
                    result.push(this.request.body)
                    for (let i = 2; i < parameters.length; i++) {
                        let parName = parameters[i].name
                        result.push(autoConvert(this.request.getParam(parName)))
                    }
                    return { status: "Exit", result: result };
                case "POST":
                    result = []
                    result.push(this.request.body)
                    for (let i = 1; i < parameters.length; i++) {
                        let parName = parameters[i].name
                        result.push(autoConvert(this.request.getParam(parName)))
                    }
                    return { status: "Exit", result: result };
            }
        }
        else return { status: "Next" }
    }
}