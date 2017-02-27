import * as Kecubung from "kecubung"
import * as Core from "../../core"
import { TransformerBase, when } from "./transformer-base"

export type MethodConventionType = "getByPage" | "get" | "add" | "modify" | "delete"

export class ApiConventionTransformer extends TransformerBase {
    private conventions: Array<MethodConventionType> = ["getByPage", "get", "add", "modify", "delete"]
    
    @when("Method")
    transform(meta: Kecubung.MethodMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        if (prevResult) {
            return this.next(prevResult);
        }
        if (this.conventions.some(x => x == meta.name)) {
            //if it doesn't contain parameter pass to other transformer
            if (meta.parameters.length < 1) {
                return this.next(<Core.RouteInfo>{
                    analysis: [Core.RouteAnalysisCode.ConventionFail],
                    initiator: "ApiConvention",
                    methodMetaData:meta,
                    overrideRequest: Core.OverrideRequest.Route,
                    //GET by design
                    httpMethod: "GET"
                });
            }
            switch (<MethodConventionType>meta.name) {
                case "getByPage":
                    return this.getByPage(meta, parent);
                case "get":
                    return this.singleParam(meta, parent, "GET");
                case "delete":
                    return this.singleParam(meta, parent, "DELETE");
                case "modify":
                    return this.singleParam(meta, parent, "PUT");
                case "add":
                    return this.add(meta, parent);
            }
        }
        return this.next()
    }


    private getByPage(meta: Kecubung.MethodMetaData, parent: string) {
        let path = "/page"
        meta.parameters.forEach(x => path += `/:${x.name}`)
        return this.exit({
            httpMethod: "GET",
            initiator: "ApiConvention",
            methodMetaData: meta,
            route: parent + path,
            methodPath: path
        });
    }


    private singleParam(meta: Kecubung.MethodMetaData, parent: string, method: Core.HttpMethod) {
        let path = "/:" + meta.parameters[0].name;
        return this.exit({
            httpMethod: method,
            initiator: "ApiConvention",
            methodMetaData: meta,
            route: parent + path,
            methodPath: path
        });
    }

    private add(meta: Kecubung.MethodMetaData, parent: string) {
        return this.exit({
            httpMethod: "POST",
            initiator: "ApiConvention",
            methodMetaData: meta,
            route: parent,
            methodPath: "/"
        });
    }
}