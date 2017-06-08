import * as Kecubung from "kecubung"
import * as Core from "kamboja-core"
import { TransformerBase, when } from "./transformer-base"
import { ControllerTransformer } from "./controller"
import { ModuleTransformer } from "./module"
import { ControllerWithDecorator } from "./controller-decorator"

export class FileTransformer extends TransformerBase {

    @when("File")
    transform(meta: Kecubung.ParentMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        this.installChildTransformer()
        let result = this.transformChildren(meta.children, parent)
        result.forEach(x => x.qualifiedClassName += `, ${meta.name}`)
        return this.exit(result)
    }

    private installChildTransformer() {
        //highest priority transformer should stay on top of another
        this.transformers = [
            new ModuleTransformer(),
            new ControllerWithDecorator(),
            new ControllerTransformer(),
        ]
    }
}