import * as Kecubung from "kecubung"
import * as Core from "kamboja-core"
import { TransformerBase, when } from "./transformer-base"


export class HttpDecoratorTransformer extends TransformerBase {
    decorators: Core.DecoratorType[] = ["get", "post", "put", "delete", "patch"]

    @when("Method")
    transform(meta: Kecubung.MethodMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        if (prevResult) {
            //too complex to handle,
            //just pass previous result
            return this.next(prevResult);
        }
        if (meta.decorators && meta.decorators.length > 0) {
            let result: Core.RouteInfo[] = [];
            let decorators = meta.decorators.filter(x => this.decorators.some(y => y == x.name))
            //single method can be assigned with multiple route,
            //so the result is multiple RouteInfo
            for (let decorator of decorators) {
                let info = this.createInfo(meta, decorator, parent);
                result.push(info);
            }
            //pass to the default action generator to fill decorator without parameter
            return this.next(result.length > 0 ? result : undefined)
        }
        else return this.next()
    }

    private createInfo(meta: Kecubung.MethodMetaData, decorator: Kecubung.DecoratorMetaData, parent:string) {
        let method = <Core.HttpMethod>decorator.name.toUpperCase();
        //if decorator doesn't contains parameter (url) then 
        //left the url empty and pass to the next transformer
        if (!decorator.parameters || decorator.parameters.length == 0) {
            return <Core.RouteInfo>{
                initiator: "HttpMethodDecorator",
                httpMethod: method,
                methodMetaData:meta,
                overrideRequest: Core.OverrideRequest.Route
            };
        }
        else {
            let route:string = (<Kecubung.PrimitiveValueMetaData>decorator.parameters[0]).value;
            //if route is relative add with parent
            if(route.charAt(0) != "/") route = parent + "/" + route;
            let analysis: number[] = []

            let routeAnalysis = this.checkMissingActionParameters(meta, route)
            if (routeAnalysis) analysis.push(routeAnalysis)

            routeAnalysis = this.checkMissingRouteParameters(meta, route, method)
            if (routeAnalysis) analysis.push(routeAnalysis)

            routeAnalysis = this.checkUnAssociatedParameters(meta, route);
            if (routeAnalysis) analysis.push(routeAnalysis)
            
            let result = <Core.RouteInfo>{
                initiator: "HttpMethodDecorator",
                httpMethod: method,
                methodMetaData: meta,
                route: route,
            };
            if(analysis.length > 0) result.analysis = analysis
            return result;
        }

    }

    private checkMissingActionParameters(meta: Kecubung.MethodMetaData, route: string) {
        //analyse if route contains parameter but method without parameter
        let routeParameters = route.split("/").filter(x => x.charAt(0) == ":");
        if (routeParameters.length > 0 && meta.parameters.length == 0) {
            return Core.RouteAnalysisCode.MissingActionParameters
        }
        return;
    }

    private checkMissingRouteParameters(meta: Kecubung.MethodMetaData, route: string, method: string) {
        //analyse if method contains parameter but route without parameter
        //this check only work for GET method, because other method can pass a BODY to the parameter
        let routeParameters = route.split("/").filter(x => x.charAt(0) == ":");
        if (method == "GET" && routeParameters.length == 0 && meta.parameters.length > 0) {
            return Core.RouteAnalysisCode.MissingRouteParameters
        }
        return;
    }

    private checkUnAssociatedParameters(meta: Kecubung.MethodMetaData, route: string) {
        //analyse if provided has associated parameter
        let parameters = meta.parameters.map(x => x.name);
        let routeParameters = route.split("/").filter(x => x.charAt(0) == ":");
        for (let x of routeParameters) {
            let parName = x.substring(1);
            if (!parameters.some(y => y == parName)) {
                return Core.RouteAnalysisCode.UnAssociatedParameters
            }
        }
        return;
    }
}