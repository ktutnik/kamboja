import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "../../core"
import { AnalyzerCommand, getRouteDetail } from "./definitions"

export class ClassNotInherritedFromControllerAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[] {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.ClassNotInheritedFromController)) {
            return [{
                code: RouteAnalysisCode.ClassNotInheritedFromController,
                type: "Error",
                message: `Class not inherited from ApiController or Controller in [${route.qualifiedClassName}]`
            }]
        }
    }
}