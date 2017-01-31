import { RouteAnalysis, RouteInfo, RouteAnalysisCode } from "../core"
import { AnalyzerCommand, getMethodName } from "./definitions"

export class MissingRouteParameterAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): RouteAnalysis[] {
        if (route.analysis && route.analysis.some(x => x == RouteAnalysisCode.MissingRouteParameters)) {
            let actionParams = route.methodMetaData
                .parameters.map(x => x.name)
            return [{
                type: "Warning",
                message: `Parameters [${actionParams.join(", ")}] in ${getMethodName(route)} doesn't have associated parameters in [${route.route}]`
            }]
        }
    }
}