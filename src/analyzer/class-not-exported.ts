import { RouteAnalysis, RouteInfo, RouteAnalysisCode } from "../core"
import { AnalyzerCommand, getMethodName } from "./definitions"

export class ClassNotExportedControllerAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): RouteAnalysis[] {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.ClassNotExported)) {
            return [{
                type: "Warning",
                message: `Can not generate route because class is not exported [${route.className}]`
            }]
        }
    }
}