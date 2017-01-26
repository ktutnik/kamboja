import * as Kecubung from "kecubung"
import * as Core from "../core"
import { TransformerBase } from "./transformer"

export class DefaultActionTransformer extends TransformerBase {
    transform(method: Kecubung.MethodMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.VisitResult {
        method.parameters.forEach(x => {
            parent += `/:${x.name}`
        })
        if (prevResult) {
            prevResult.forEach(x => {
                if (!x.route) {
                    x.route = parent;
                    x.generatingMethod += ",Default"
                }
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