import { RouteAnalysis, RouteInfo, RouteAnalysisCode } from "../../core"
import { AnalyzerCommand, getMethodName } from "./definitions"

export class ConventionFailDecoratorAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): RouteAnalysis[] {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.ConventionFail)) {
            return [{
                type: "Warning",
                message: `Method name match API Convention but has lack of parameters in ${getMethodName(route)}\n`
            }]
        }
    }
}