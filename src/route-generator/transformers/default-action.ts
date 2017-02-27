import * as Kecubung from "kecubung"
import * as Core from "../../core"
import { TransformerBase, when } from "./transformer-base"

export class DefaultActionTransformer extends TransformerBase {
    @when("Method")
    transform(method: Kecubung.MethodMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        let path = "/" + method.name.toLowerCase()
        method.parameters.forEach(x => {
            path += `/:${x.name}`
        })
        if (prevResult) {
            prevResult.forEach(x => {
                if (Kecubung.flag(x.overrideRequest, Core.OverrideRequest.Route)) {
                    x.route = parent + path;
                    x.methodPath = path
                }
                x.collaborator = [];
                x.collaborator.push("DefaultAction")
            })
            return this.exit(prevResult);
        }
        else {
            return this.exit([<Core.RouteInfo>{
                initiator: "DefaultAction",
                route: parent + path,
                httpMethod: "GET",
                methodMetaData: method,
                methodPath: path
            }]);
        }
    }
}