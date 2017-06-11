import {RouteInfo, HttpRequest} from "kamboja-core"
import {BinderBase} from "./binder-base"
import {convert} from "./value-converter"

export class ApiConventionBinder extends  BinderBase{
    bind(routeInfo:RouteInfo, parameterName:string, request:HttpRequest){
        if(routeInfo.classMetaData.baseClass == "ApiController"){
            let index = routeInfo.methodMetaData.parameters.findIndex(x => x.name == parameterName)
            if(index == 0 && routeInfo.methodMetaData.name == "add")
                return this.exit(request.body)
            if(index == 1 && (routeInfo.methodMetaData.name == "replace" || routeInfo.methodMetaData.name == "modify"))
                return this.exit(request.body)
        }
        return this.next()
    }
}