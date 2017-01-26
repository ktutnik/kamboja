import * as Kecubung from "kecubung"
import * as Core from "../core"
import { TransformerBase } from "./transformer-base"
import { ApiConventionTransformer } from "./api-convention"
import { DefaultActionTransformer } from "./default-action"
import { HttpDecoratorTransformer } from "./http-decorator"
import { InternalDecoratorTransformer } from "./internal-decorator"

export class ControllerTransformer extends TransformerBase {

    transform(meta: Kecubung.ClassMetaData,
        parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        this.installChildTransformer(meta)

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

    private installChildTransformer(meta:Kecubung.ClassMetaData){
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
    }
}