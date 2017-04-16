import * as Kecubung from "kecubung"
import * as Core from "../../core"
import { when, TransformerBase } from "./transformer-base"
import { ControllerBaseTransformer } from "./controller-base"



export class ControllerTransformer extends ControllerBaseTransformer {

    @when("Class")
    transform(meta: Kecubung.ClassMetaData,
        parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        let transformResult = super.transform(meta, parent, prevResult)
        if (transformResult && transformResult.status == "ExitWithResult") return transformResult
        let name = this.getName(meta)
        if (!parent) parent = ""
        parent += "/" + name
        let result = this.transformChildren(meta.methods, parent)
        result.forEach(x => {
            x.qualifiedClassName = meta.name
            x.classMetaData = meta
            //if (x.initiator != "HttpMethodDecorator") x.classPath = parent
            if (!x.collaborator) x.collaborator = []
            x.collaborator.push("Controller")
        })
        return this.exit(result)
    }
}