import * as Core from "kamboja-core"
import {BinderBase, BinderResult} from "./binder-base"
import {ApiConventionBinder} from "./api-convention-binder"
import {DecoratorBinder} from "./decorator-binder"
import {DefaultBinder} from "./default-binder"

export class ParameterBinder {
    private commands: BinderBase[] = []
    constructor(private routeInfo: Core.RouteInfo, private request: Core.HttpRequest) {
        //priorities
        this.commands = [
            new DecoratorBinder(),
            new ApiConventionBinder(),
            new DefaultBinder()
        ]
    }

    getParameters(): Array<any> {
        if(!this.routeInfo.methodMetaData.parameters 
            || this.routeInfo.methodMetaData.parameters.length == 0)
            return []
        let result = []
        for(let par of this.routeInfo.methodMetaData.parameters){
            result.push(this.bind(par.name))
        }
        return result
    }

    private bind(parameterName:string){
        for(let cmd of this.commands){
            let result = cmd.bind(this.routeInfo, parameterName, this.request)
            if(result.type == "Exit") return result.value;
        }
    }
}
