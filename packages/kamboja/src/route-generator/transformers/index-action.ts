import * as Kecubung from "kecubung"
import * as Core from "kamboja-core"
import { TransformerBase, when } from "./transformer-base"

export class IndexActionTransformer extends TransformerBase {
    @when("Method")
    transform(method: Kecubung.MethodMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        if (prevResult) return this.next(prevResult);
        if (method.name.toLowerCase() == "index") {
            method.parameters.forEach(x => {
                parent += `/:${x.name}`
            })
            return this.exit([<Core.RouteInfo>{
                initiator: "IndexAction",
                route: parent,
                httpMethod: "GET",
                methodMetaData: method
            }]);
        }
        else return this.next();
    }
}