import * as Kecubung from "kecubung"
import * as Core from "../../core"
import { when, TransformerBase } from "./transformer-base"
import { ControllerBaseTransformer } from "./controller-base"

export class ControllerWithDecorator extends ControllerBaseTransformer {
    @when("Class")
    transform(meta: Kecubung.ClassMetaData,
        parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult {
        let transformResult = super.transform(meta, parent, prevResult)
        if (transformResult && transformResult.status == "ExitWithResult") return transformResult

        if (meta.decorators && meta.decorators.some(x => x.name == "root")) {
            let decorators = meta.decorators.filter(x => x.name == "root")
            if (decorators.length > 1) {
                return this.exit(<Core.RouteInfo>{
                    analysis: [Core.RouteAnalysisCode.DuplicateRoutes],
                    qualifiedClassName: meta.name,
                    initiator: "Controller",
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
                x.collaborator.push("Controller")
                if (!this.queryAssociated(route, x.methodMetaData)) {
                    if (!x.analysis) x.analysis = []
                    x.analysis.push(Core.RouteAnalysisCode.MissingActionParameters)
                }
            })
            return this.exit(result)
        }
        else return this.next()
    }

    private queryAssociated(parent: string, meta: Kecubung.MethodMetaData) {
        let routeParameters = parent.split("/")
            .filter(x => x.charAt(0) == ":")
            .map(x => x.substr(1));
        if (routeParameters.length > 0) {
            let associated = meta.parameters
                .filter(par => routeParameters.some(qry => qry == par.name))
            return associated.length == routeParameters.length
        }
        return true
    }
}