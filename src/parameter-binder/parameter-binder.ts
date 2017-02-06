import * as Core from "../core"
import {BinderCommand, BinderResult, autoConvert} from "./baseclasses"
import {ApiConventionParameterBinder} from "./api-convention-parameter-binder"
import {DefaultParameterBinder} from "./default-parameter-binder"

export class ParameterBinder {
    private commands: BinderCommand[] = []
    constructor(private routeInfo: Core.RouteInfo, private request: Core.HttpRequest) {
        //priorities
        this.commands = [
            new ApiConventionParameterBinder(this.routeInfo, this.request),
            new DefaultParameterBinder(this.routeInfo, this.request),
        ]
    }

    getParameters(): Array<any> {
        for (let command of this.commands) {
            let commandResult = command.getParameters();
            if (commandResult.status == "Exit")
                return commandResult.result;
        }
    }
}
