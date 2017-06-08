import { RouteInfo, AnalysisMessage, getRouteDetail } from "kamboja-core"


export interface AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[];
}

export { getRouteDetail }