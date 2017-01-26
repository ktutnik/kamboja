import * as Kecubung from "kecubung"
import * as Core from "../core"
import { TransformerBase } from "./transformer"

export class InternalDecoratorTransformer extends TransformerBase {
    private decorators: Array<Core.DecoratorType> = ["get", "put", "post", "delete", "internal"]
    transform(meta: Kecubung.MethodMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.VisitResult {
        if (prevResult) {
            this.next(prevResult)
        }
        if (meta.decorators && meta.decorators.length > 0) {
            let decorators = meta.decorators.filter(x => this.decorators.some(y => y == x.name))

            //decorator conflict with internal
            if ((decorators.some(x => <Core.DecoratorType>x.name == "internal")
                && decorators.length != 1)) {

                return this.next([<Core.RouteInfo>{
                    analysis: [Core.RouteAnalysisCode.ConflictDecorators],
                    methodName: meta.name,
                    parameters: meta.parameters.map(x => x.name),
                    httpMethod: "GET",
                    generatingMethod: "HttpMethodDecorator"
                }]);
            }

            for (let decorator of meta.decorators) {
                let name = <Core.DecoratorType>decorator.name;
                if (name == "internal") return this.exit()
            }
        }
        return this.next();
    }
}