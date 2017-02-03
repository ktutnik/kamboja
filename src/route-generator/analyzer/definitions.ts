import { RouteInfo, RouteAnalysis, getMethodName } from "../../core"


export interface AnalyzerCommand {
    analyse(route: RouteInfo): RouteAnalysis[];
}

export { getMethodName }