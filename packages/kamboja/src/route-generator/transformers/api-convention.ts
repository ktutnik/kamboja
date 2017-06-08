import * as Kecubung from "kecubung"
import * as Core from "kamboja-core"
import { TransformerBase, when } from "./transformer-base"

export type MethodConventionType = "get" | "list" | "add" | "replace" | "modify" | "delete"

export class ApiConventionTransformer extends TransformerBase {
    private conventions: Array<MethodConventionType> = ["get", "list", "add", "replace", "modify", "delete"]

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
                    methodMetaData: meta,
                    overrideRequest: Core.OverrideRequest.Route,
                    //GET by design
                    httpMethod: "GET"
                });
            }
            switch (<MethodConventionType>meta.name) {
                case "list":
                    return this.noParam(meta, parent, "GET");
                case "get":
                    return this.singleParam(meta, parent, "GET");
                case "delete":
                    return this.singleParam(meta, parent, "DELETE");
                case "replace":
                    return this.singleParam(meta, parent, "PUT")
                case "modify":
                    return this.singleParam(meta, parent, "PATCH");
                case "add":
                    return this.noParam(meta, parent, "POST");
            }
        }
        return this.next()
    }

    private singleParam(meta: Kecubung.MethodMetaData, parent: string, method: Core.HttpMethod) {
        let path = "/:" + meta.parameters[0].name;
        //auto assigned required validation on id
        if (!meta.parameters[0].decorators) meta.parameters[0].decorators = []
        if (!meta.parameters[0].decorators.some(x => x.name == "required")) {
            meta.parameters[0].decorators.push({
                type: 'Decorator',
                name: 'required',
                analysis: 1,
                location: { start: 1124, end: 1164 },
                parameters: []
            })
        }

        return this.exit({
            httpMethod: method,
            initiator: "ApiConvention",
            methodMetaData: meta,
            route: parent + path,
            methodPath: path
        });
    }

    private noParam(meta: Kecubung.MethodMetaData, parent: string, method: Core.HttpMethod) {
        return this.exit({
            httpMethod: method,
            initiator: "ApiConvention",
            methodMetaData: meta,
            route: parent,
            methodPath: "/"
        });
    }
}