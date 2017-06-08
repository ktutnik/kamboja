import { RouteInfo, AnalysisMessage } from "kamboja-core"
import { RouteAnalyzer } from "./analyzer"

export function analyze(info: RouteInfo[]) {
    let analyzer = new RouteAnalyzer(info)
    return analyzer.analyse();
}
