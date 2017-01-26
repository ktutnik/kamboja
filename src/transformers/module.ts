import * as Kecubung from "kecubung"
import * as Core from "../core"
import { TransformerBase } from "./transformer-base"
import { ControllerTransformer } from "./controller"

export class ModuleTransformer extends TransformerBase {

    transform(meta: Kecubung.ParentMetaData,
        parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        this.installChildTransformer()
        parent += "/" + meta.name.toLowerCase();
        let result = this.traverse(meta.children, parent)
        return this.exit(result)
    }

    private installChildTransformer() {
        //highest priority transformer should stay on top of another
        this.transformers = [
            new ModuleTransformer(),
            new ControllerTransformer(),
        ]
    }
}