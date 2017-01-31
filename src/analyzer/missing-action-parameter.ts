import { RouteAnalysis, RouteInfo, RouteAnalysisCode } from "../core"
import { AnalyzerCommand, getMethodName } from "./definitions"

export class MissingActionParameterAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): RouteAnalysis[] {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.MissingActionParameters)) {
            let routeParams = route.route.split("/")
                .filter(x => x.charAt(0) == ":")
                .map(x => x.substring(1))
            return [{
                type: "Warning",
                message: `Parameters [${routeParams.join(", ")}] in [${route.route}] doesn't have associated parameters in ${getMethodName(route)}`
            }]
        }
    }
}