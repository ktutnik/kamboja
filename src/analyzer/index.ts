import { RouteInfo, RouteAnalysis } from "../core"
import { RouteAnalyzer } from "./analyzer"

export function analyze(info: RouteInfo[]) {
    let analyzer = new RouteAnalyzer(info)
    return analyzer.analyse();
}
