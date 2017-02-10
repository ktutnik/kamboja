import { RouteInfo, AnalysisMessage, getMethodName } from "../../core"


export interface AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[];
}

export { getMethodName }