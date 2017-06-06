import * as Core from "../core"
import {BinderCommand, BinderResult} from "./baseclasses"
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
        if(!this.routeInfo.methodMetaData.parameters 
            || this.routeInfo.methodMetaData.parameters.length == 0)
            return []
        for (let command of this.commands) {
            let commandResult = command.getParameters();
            if (commandResult.status == "Exit")
                return commandResult.result;
        }
    }
}
