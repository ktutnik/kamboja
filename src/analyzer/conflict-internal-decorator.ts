import { RouteAnalysis, RouteInfo, RouteAnalysisCode } from "../core"
import { AnalyzerCommand, getMethodName } from "./definitions"

export class ConflictInternalDecoratorAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): RouteAnalysis[] {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.ConflictDecorators)) {
            return [{
                type: "Error",
                message: `Method decorated with @http will not visible, because the method is decorated @internal in ${getMethodName(route)}`
            }]
        }
    }
}