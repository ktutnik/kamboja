import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "kamboja-core"
import { AnalyzerCommand, getRouteDetail } from "./definitions"

export class ClassNotExportedControllerAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[] {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.ClassNotExported)) {
            return [{
                code: RouteAnalysisCode.ClassNotExported,
                type: "Warning",
                message: `Can not generate route because class is not exported [${route.qualifiedClassName}]`
            }]
        }
    }
}