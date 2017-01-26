import * as Kecubung from "kecubung"
import * as Core from "../core"
import { TransformerBase } from "./transformer-base"

export class DefaultActionTransformer extends TransformerBase {
    transform(method: Kecubung.MethodMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        parent += "/" + method.name.toLowerCase()
        method.parameters.forEach(x => {
            parent += `/:${x.name}`
        })
        if (prevResult) {
            prevResult.forEach(x => {
                x.route = parent;
                x.generatingMethod = "Default"
            })
            return this.exit(prevResult);
        }
        else {
            return this.exit([<Core.RouteInfo>{
                generatingMethod: "Default",
                route: parent,
                httpMethod: "GET",
                methodName: method.name,
                parameters: method.parameters.map(x => x.name)
            }]);
        }
    }
}