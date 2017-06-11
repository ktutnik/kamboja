import {RouteInfo, HttpRequest} from "kamboja-core"
import {BinderBase} from "./binder-base"
import {convert} from "./value-converter"

export class DefaultBinder extends  BinderBase{
    bind(routeInfo:RouteInfo, parameterName:string, request:HttpRequest){
        return this.exit(convert(routeInfo, parameterName, request.getParam(parameterName)))
    }
}