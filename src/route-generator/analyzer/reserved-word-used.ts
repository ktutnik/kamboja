import { RouteAnalysis, RouteInfo, RouteAnalysisCode } from "../../core"
import { AnalyzerCommand, getMethodName } from "./definitions"

const reservedWords = ["view", "json", "redirect", "file"]

export class ReservedWordUsedAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): RouteAnalysis[] {
        if (reservedWords.some(x => route.methodMetaData 
            && x == route.methodMetaData.name 
            && route.classMetaData.baseClass == "Controller")) {
            return [{
                code: RouteAnalysisCode.UnAssociatedParameters,
                type: "Error",
                message: `[${route.methodMetaData.name}] must not be used as action, because it will override the Controller method, in [${getMethodName(route)}]`
            }]
        }
    }
}