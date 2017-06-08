import * as Kecubung from "kecubung"
import * as Core from "kamboja-core"
import { when, TransformerBase } from "./transformer-base"
import { ApiConventionTransformer } from "./api-convention"
import { DefaultActionTransformer } from "./default-action"
import { HttpDecoratorTransformer } from "./http-decorator"
import { InternalDecoratorTransformer } from "./internal-decorator"
import { IndexActionTransformer } from "./index-action"

function getName(meta: Kecubung.ClassMetaData) {
    let ctlLocation = meta.name.toLowerCase().lastIndexOf("controller");
    if (ctlLocation > 0) {
        return meta.name.substr(0, ctlLocation).toLocaleLowerCase();
    }
    else {
        return meta.name.toLocaleLowerCase()
    }
}

export function getTransformers(meta: Kecubung.ClassMetaData) {
    //highest priority transformer should stay on top of another
    if (meta.baseClass == "ApiController") {
        return [
            new InternalDecoratorTransformer(),
            new HttpDecoratorTransformer(),
            new ApiConventionTransformer(),
            new DefaultActionTransformer()
        ]
    }
    else {
        return [
            new InternalDecoratorTransformer(),
            new HttpDecoratorTransformer(),
            //new IndexActionTransformer(),
            new DefaultActionTransformer()
        ]
    }
}

export function checkForAnalysis(meta: Kecubung.ClassMetaData) {
    //check if class inherrited from Controler or ApiController
    if (!meta.baseClass ||
        !(meta.baseClass == "Controller"
            || meta.baseClass == "ApiController"))
        return <Core.RouteInfo>{
            analysis: [Core.RouteAnalysisCode.ClassNotInheritedFromController],
            qualifiedClassName: meta.name,
            initiator: "Controller",
            classMetaData: meta
        };
    //check if class is valid (exported)
    if (!Kecubung.flag(meta.analysis, Kecubung.AnalysisType.Valid))
        return <Core.RouteInfo>{
            analysis: [Core.RouteAnalysisCode.ClassNotExported],
            qualifiedClassName: meta.name,
            initiator: "Controller",
            classMetaData: meta
        };
    return
}


export class ControllerTransformer extends TransformerBase {

    @when("Class")
    transform(meta: Kecubung.ClassMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        let checkResult = checkForAnalysis(meta)
        if (checkResult) return this.exit(checkResult)
        this.transformers = getTransformers(meta)
        let name = getName(meta)
        if (!parent) parent = ""
        parent += "/" + name
        let result = this.transformChildren(meta.methods, parent)
        result.forEach(x => {
            x.qualifiedClassName = meta.name
            x.classMetaData = meta
            if (!x.collaborator) x.collaborator = []
            x.collaborator.push("Controller")
        })
        return this.exit(result)
    }
}