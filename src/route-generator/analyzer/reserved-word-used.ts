import { AnalysisMessage, RouteInfo, RouteAnalysisCode } from "../../core"
import { AnalyzerCommand, getMethodName } from "./definitions"
import {ApiController, Controller} from "../../controller"

type ControllerMemberNames = keyof Controller 
type ApiControllerMemberNames = keyof ApiController 

const reservedWords:ControllerMemberNames[] = [
    "request", "validator", "setCookie", "view", "redirect", "file", "json"]

const apiReservedWords:ApiControllerMemberNames[] = [
    "request", "validator", "ok", "invalid"]

 

export class ReservedWordUsedAnalyzer implements AnalyzerCommand {
    analyse(route: RouteInfo): AnalysisMessage[] {
        let usedInController = reservedWords.some(x => route.methodMetaData 
            && x == route.methodMetaData.name)
            && route.classMetaData.baseClass == "Controller"
        let usedInApiController = apiReservedWords.some(x => route.methodMetaData 
            && x == route.methodMetaData.name)
            && route.classMetaData.baseClass == "ApiController"
        if (usedInApiController || usedInController) {
            return [{
                code: RouteAnalysisCode.UnAssociatedParameters,
                type: "Error",
                message: `[${route.methodMetaData.name}] must not be used as action, because it will override the Controller method, in [${getMethodName(route)}]`
            }]
        }
    }
}