import * as Kecubung from "kecubung"
import * as Core from "../../core"
import { when, TransformerBase } from "./transformer-base"
import { getTransformers, checkForAnalysis } from "./controller"

export class ControllerWithDecorator extends TransformerBase {
    @when("Class")
    transform(meta: Kecubung.ClassMetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        let checkResult = checkForAnalysis(meta)
        if (checkResult) return this.exit(checkResult)
        this.transformers = getTransformers(meta)

        if (meta.decorators && meta.decorators.some(x => x.name == "root")) {
            let decorators = meta.decorators.filter(x => x.name == "root")
            if (decorators.length > 1) {
                return this.exit(<Core.RouteInfo>{
                    analysis: [Core.RouteAnalysisCode.DuplicateRoutes],
                    qualifiedClassName: meta.name,
                    initiator: "ControllerWithDecorator",
                    classMetaData: meta
                });
            }
            let route: string = (<Kecubung.PrimitiveValueMetaData>decorators[0].parameters[0]).value
            if (route.charAt(0) != "/") {
                if (!parent) parent = ""
                route = parent + "/" + route;
            }
            let result = this.transformChildren(meta.methods, route)
            result.forEach(x => {
                x.qualifiedClassName = meta.name
                x.classMetaData = meta
                if (!x.collaborator) x.collaborator = []
                x.collaborator.push("ControllerWithDecorator")
            })
            return this.exit(result)
        }
        else return this.next()
    }

}