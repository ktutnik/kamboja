import * as Kecubung from "kecubung"
import * as Core from "../../core"
import { TransformerBase, when } from "./transformer-base"
import { ApiConventionTransformer } from "./api-convention"
import { DefaultActionTransformer } from "./default-action"
import { HttpDecoratorTransformer } from "./http-decorator"
import { InternalDecoratorTransformer } from "./internal-decorator"
import { IndexActionTransformer } from "./index-action"

export class ControllerBaseTransformer extends TransformerBase {

    transform(meta: Kecubung.ClassMetaData,
        parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        //check if class inherrited from Controler or ApiController
        if (!meta.baseClass ||
            !(meta.baseClass == "Controller"
                || meta.baseClass == "ApiController"))
            return this.exit(<Core.RouteInfo>{
                analysis: [Core.RouteAnalysisCode.ClassNotInheritedFromController],
                qualifiedClassName: meta.name,
                initiator: "Controller",
                classMetaData: meta
            });
        //check if class is valid (exported)
        if (!Kecubung.flag(meta.analysis, Kecubung.AnalysisType.Valid))
            return this.exit(<Core.RouteInfo>{
                analysis: [Core.RouteAnalysisCode.ClassNotExported],
                qualifiedClassName: meta.name,
                initiator: "Controller",
                classMetaData: meta
            });

        this.installChildTransformer(meta)
    }

    protected getName(meta: Kecubung.ClassMetaData) {
        let ctlLocation = meta.name.toLowerCase().lastIndexOf("controller");
        if (ctlLocation > 0) {
            return meta.name.substr(0, ctlLocation).toLocaleLowerCase();
        }
        else {
            return meta.name.toLocaleLowerCase()
        }
    }

    protected installChildTransformer(meta: Kecubung.ClassMetaData) {
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
                //new IndexActionTransformer(),
                new DefaultActionTransformer()
            ]
        }
    }
}