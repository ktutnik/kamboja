import { RouteAnalysis, RouteInfo, RouteAnalysisCode } from "../core"
import { AnalyzerCommand, getMethodName } from "./definitions"

export class ClassNotExportedControllerAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): RouteAnalysis[] {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.ClassNotExported)) {
            let message = `Found not exported Class/Module in [${route.className}]`;
            return [{
                type: "Warning",
                message: message
            }]
        }
    }
}