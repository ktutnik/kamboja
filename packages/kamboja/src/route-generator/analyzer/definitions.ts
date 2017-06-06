import { RouteInfo, AnalysisMessage, getRouteDetail } from "../../core"


export interface AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[];
}

export { getRouteDetail }