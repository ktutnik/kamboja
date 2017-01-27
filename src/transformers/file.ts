import * as Kecubung from "kecubung"
import * as Core from "../core"
import { TransformerBase } from "./transformer-base"
import { ControllerTransformer } from "./controller"
import { ModuleTransformer } from "./module"

export class FileTransformer extends TransformerBase {

    @Core.when("File")
    transform(meta: Kecubung.ParentMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        this.installChildTransformer()
        let result = this.transformChildren(meta.children, parent)
        result.forEach(x => x.className += `, ${meta.name}`)
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