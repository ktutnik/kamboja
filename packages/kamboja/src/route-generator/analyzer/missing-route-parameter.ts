import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "../../core"
import { AnalyzerCommand, getRouteDetail } from "./definitions"

export class MissingRouteParameterAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[] {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.MissingRouteParameters)) {
            let actionParams = route.methodMetaData
                .parameters.map(x => x.name)
            return [{
                code: RouteAnalysisCode.MissingRouteParameters,
                type: "Warning",
                message: `Parameters [${actionParams.join(", ")}] in ${getRouteDetail(route)} doesn't have associated parameters in [${route.route}]`
            }]
        }
    }
}