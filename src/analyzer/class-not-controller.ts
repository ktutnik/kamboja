import { RouteAnalysis, RouteInfo, RouteAnalysisCode } from "../core"
import { AnalyzerCommand, getMethodName } from "./definitions"

export class ClassNotInherritedFromControllerAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): RouteAnalysis[] {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.ClassNotInherritedFromController)) {
            let message = `Class not inherited from ApiController or Controller in [${route.className}]`;
            return [{
                type: "Error",
                message: message
            }]
        }
    }
}