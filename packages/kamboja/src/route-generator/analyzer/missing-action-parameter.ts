import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "kamboja-core"
import { AnalyzerCommand, getRouteDetail } from "./definitions"

export class MissingActionParameterAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[] {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.MissingActionParameters)) {
            let routeParams = route.route.split("/")
                .filter(x => x.charAt(0) == ":")
                .map(x => x.substring(1))
            return [{
                code: RouteAnalysisCode.MissingActionParameters,
                type: "Warning",
                message: `Parameters [${routeParams.join(", ")}] in [${route.route}] doesn't have associated parameters in ${getRouteDetail(route)}`
            }]
        }
    }
}