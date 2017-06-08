import * as Kecubung from "kecubung"
import * as Core from "kamboja-core"
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
            this.autoAssignedValidator(meta, route)
            let result = this.transformChildren(meta.methods, route)
            result.forEach(x => {
                this.checkUnassociatedParameter(x, route)
                x.qualifiedClassName = meta.name
                x.classMetaData = meta
                if (!x.collaborator) x.collaborator = []
                x.collaborator.push("ControllerWithDecorator")
            })
            return this.exit(result)
        }
        else return this.next()
    }

    private checkUnassociatedParameter(info: Core.RouteInfo, route: string) {
        let param = route.split("/").filter(x => x.charAt(0) == ":")
            .map(x => x.substring(1))
        let match = info.methodMetaData.parameters.filter(x => param.some(y => x.name == y))
        if (match.length != param.length) {
            if (!info.analysis) info.analysis = []
            if (!info.analysis.some(x => x == Core.RouteAnalysisCode.UnAssociatedParameters))
                info.analysis.push(Core.RouteAnalysisCode.UnAssociatedParameters)
        }
    }

    private autoAssignedValidator(meta: Kecubung.ClassMetaData, route: string) {
        let param = route.split("/").filter(x => x.charAt(0) == ":")
            .map(x => x.substring(1))
        meta.methods.forEach(method => {
            let getAction = meta.methods.filter(x => x.name == method.name)[0]
            let parameters = getAction.parameters.filter(x => param.some(y => y == x.name))
            parameters.forEach(x => {
                if (!x.decorators) x.decorators = []
                if (!x.decorators.some(x => x.name == "required")) {
                    x.decorators.push({
                        type: 'Decorator',
                        name: 'required',
                        analysis: 1,
                        location: { start: 1124, end: 1164 },
                        parameters: []
                    })
                }
            })
        })
    }
}