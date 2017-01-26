import * as Kecubung from "kecubung"
import * as Core from "../core"
import { TransformerBase } from "./transformer"
import { ApiConventionTransformer } from "./transformer-api-convention"
import { DefaultActionTransformer } from "./transformer-default-action"
import { HttpDecoratorTransformer } from "./transformer-http-decorator"
import { InternalDecoratorTransformer } from "./transformer-internal-decorator"

export class ControllerTransformer extends TransformerBase {

    transform(meta: Kecubung.ClassMetaData,
        parent: string, prevResult: Core.RouteInfo[]): Core.VisitResult {
        //highest priority transformer should stay on top of another
        if (meta.baseClass == "ApiController") {
            this.transformers = [
                new InternalDecoratorTransformer(),
                new HttpDecoratorTransformer(),
                new ApiConventionTransformer(),
                new DefaultActionTransformer()
            ]
        }
        else if (meta.baseClass == "Controller") {
            this.transformers = [
                new InternalDecoratorTransformer(),
                new HttpDecoratorTransformer(),
                new DefaultActionTransformer()
            ]
        }

        let ctlLocation = meta.name.toLowerCase().lastIndexOf("controller");
        if (ctlLocation > -1) {
            let name = meta.name.substr(0, ctlLocation);
            parent += "/" + name.toLowerCase();
        }
        else {
            parent += "/" + meta.name.toLowerCase();
        }
        let result = this.traverse(meta.methods, parent)
        result.forEach(x => {
            x.className = meta.name
        })
        return this.exit(result)
    }
}