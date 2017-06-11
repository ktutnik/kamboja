import { RouteInfo, HttpRequest } from "kamboja-core"
import { BinderBase } from "./binder-base"
import { convert } from "./value-converter"
import { DecoratorMetaData, PrimitiveValueMetaData } from "kecubung"

export class DecoratorBinder extends BinderBase {
    bind(routeInfo: RouteInfo, parameterName: string, request: HttpRequest) {
        let decorators = routeInfo.methodMetaData.parameters
            .filter(x => x.name == parameterName)[0]
            .decorators
        if (!decorators) return this.next()

        let decorator = decorators.filter(x => x.name == "body" || x.name == "cookie")[0]
        if (!decorator) return this.next()

        if(decorator.name == "cookie") {
            let value = convert(routeInfo, parameterName, this.extractCookie(request, decorator))
            return this.exit(value)
        }
        else {
            return this.exit(request.body)
        }
    }

    private extractCookie(request: HttpRequest, decorator: DecoratorMetaData) {
        if(!decorator.parameters || decorator.parameters.length == 0){
            return request.cookies;
        }
        else {
            let name = (<PrimitiveValueMetaData> decorator.parameters[0]).value;
            return request.getCookie(name)
        }
    }
}