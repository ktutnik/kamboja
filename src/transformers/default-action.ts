import * as Kecubung from "kecubung"
import * as Core from "../core"
import { TransformerBase } from "./transformer-base"

export class DefaultActionTransformer extends TransformerBase {
    @Core.when("Method")
    transform(method: Kecubung.MethodMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        parent += "/" + method.name.toLowerCase()
        method.parameters.forEach(x => {
            parent += `/:${x.name}`
        })
        if (prevResult) {
            prevResult.forEach(x => {
                if (Kecubung.flag(x.overrideRequest, Core.OverrideRequest.Route)) {
                    x.route = parent;
                }
                if (!x.collaborator) x.collaborator = [];
                x.collaborator.push("DefaultAction")
            })
            return this.exit(prevResult);
        }
        else {
            return this.exit([<Core.RouteInfo>{
                initiator: "DefaultAction",
                route: parent,
                httpMethod: "GET",
                methodName: method.name,
                parameters: method.parameters.map(x => x.name)
            }]);
        }
    }
}