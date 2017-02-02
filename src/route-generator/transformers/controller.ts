import * as Kecubung from "kecubung"
import * as Core from "../../core"
import { TransformerBase, when } from "./transformer-base"
import { ApiConventionTransformer } from "./api-convention"
import { DefaultActionTransformer } from "./default-action"
import { HttpDecoratorTransformer } from "./http-decorator"
import { InternalDecoratorTransformer } from "./internal-decorator"
import { IndexActionTransformer } from "./index-action"

export class ControllerTransformer extends TransformerBase {

    @when("Class")
    transform(meta: Kecubung.ClassMetaData,
        parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        //check if class inherrited from Controler or ApiController
        if (!meta.baseClass ||
            !(meta.baseClass == "Controller"
                || meta.baseClass == "ApiController"))
            return this.exit(<Core.RouteInfo>{
                analysis: [Core.RouteAnalysisCode.ClassNotInheritedFromController],
                className: meta.name,
                initiator: "Controller",
            });
        //check if class is valid (exported)
        if (!Kecubung.flag(meta.analysis, Kecubung.AnalysisType.Valid))
            return this.exit(<Core.RouteInfo>{
                analysis: [Core.RouteAnalysisCode.ClassNotExported],
                className: meta.name,
                initiator: "Controller",
            });

        this.installChildTransformer(meta)

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
            x.baseClass = meta.baseClass
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
                new IndexActionTransformer(),
                new DefaultActionTransformer()
            ]
        }
    }
}