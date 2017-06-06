import * as Core from "../core"
import { BinderCommand, BinderResult } from "./baseclasses"
import { convert } from "./value-converter"

export class DefaultParameterBinder {
    constructor(private routeInfo: Core.RouteInfo, private request: Core.HttpRequest) { }

    getParameters(): BinderResult {
        let result: any[] = []
        this.routeInfo.methodMetaData
            .parameters.forEach(x => {
                result.push(convert(this.routeInfo, x.name, this.request.getParam(x.name)))
            })
        return { status: "Exit", result: result };
    }
}
