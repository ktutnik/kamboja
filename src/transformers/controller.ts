import * as Kecubung from "kecubung"
import * as Core from "../core"
import { TransformerBase } from "./transformer-base"
import { ApiConventionTransformer } from "./api-convention"
import { DefaultActionTransformer } from "./default-action"
import { HttpDecoratorTransformer } from "./http-decorator"
import { InternalDecoratorTransformer } from "./internal-decorator"

export class ControllerTransformer extends TransformerBase {

    @Core.when("Class")
    transform(meta: Kecubung.ClassMetaData,
        parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        if (!meta.baseClass || 
            !(meta.baseClass == "Controller" 
                || meta.baseClass == "ApiController")) return this.exit();
        this.installChildTransformer(meta)
        if (!Kecubung.flag(meta.analysis, Kecubung.AnalysisType.Valid)) return this.exit();

        let ctlLocation = meta.name.toLowerCase().lastIndexOf("controller");
        if (ctlLocation > 0) {
            let name = meta.name.substr(0, ctlLocation);
            parent += "/" + name.toLowerCase();
        }
        else {
            parent += "/" + meta.name.toLowerCase();
        }
        let result = this.transformChildren(meta.methods, parent)
        result.forEach(x => {
            x.className = meta.name
            if (!x.collaborator) x.collaborator = []
            x.collaborator.push("Controller")
        })
        return this.exit(result)
    }

    private installChildTransformer(meta: Kecubung.ClassMetaData) {
        //highest priority transformer should stay on top of another
        if (meta.baseClass == "ApiController") {
            this.transformers = [
                new InternalDecoratorTransformer(),
                new HttpDecoratorTransformer(),
                new ApiConventionTransformer(),
                new DefaultActionTransformer()
            ]
        }
        else {
            this.transformers = [
                new InternalDecoratorTransformer(),
                new HttpDecoratorTransformer(),
                new DefaultActionTransformer()
            ]
        }
    }
}