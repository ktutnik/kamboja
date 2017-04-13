import * as Core from "../core"
import {BinderCommand, BinderResult, autoConvert} from "./baseclasses"
import { MethodConventionType } from "../route-generator"

export class ApiConventionParameterBinder {
    constructor(private routeInfo: Core.RouteInfo, private request: Core.HttpRequest) { }

    getParameters(): BinderResult {
        if (this.routeInfo.initiator == "ApiConvention") {
            switch (this.routeInfo.httpMethod) {
                case "GET":
                case "DELETE":
                    return { status: "Next" };
                case "PATCH":
                case "PUT":
                    let result = [];
                    let id = this.routeInfo.methodMetaData
                        .parameters[0].name
                    result.push(autoConvert(this.request.getParam(id)))
                    result.push(this.request.body)
                    for(let i = 1; i < this.routeInfo.methodMetaData.parameters.length; i++){
                        //TODO: 
                    }
                    return { status: "Exit", result: result };
                case "POST":
                    return { status: "Exit", result: [this.request.body] };
            }
        }
        else return { status: "Next" }
    }
}