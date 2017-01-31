import { RouteAnalysis, RouteInfo, RouteAnalysisCode } from "../../core"
import { AnalyzerCommand, getMethodName } from "./definitions"

export class ClassNotInherritedFromControllerAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): RouteAnalysis[] {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.ClassNotInheritedFromController)) {
            return [{
                type: "Error",
                message: `Class not inherited from ApiController or Controller in [${route.className}]`
            }]
        }
    }
}