import * as Core from "../core"
import {BinderCommand, BinderResult, autoConvert} from "./baseclasses"

export class DefaultParameterBinder {
    constructor(private routeInfo: Core.RouteInfo, private request: Core.HttpRequest) { }

    getParameters(): BinderResult {
        let result: any[] = []
        let routeParams = this.routeInfo.route
            .split("/")
            .filter(x => x.charAt(0) == ":")
            .map(x => x.substring(1))
        for (let item of routeParams) {
            result.push(autoConvert(this.request.getParam(item)))
        }
        return { status: "Exit", result: result };
    }
}
