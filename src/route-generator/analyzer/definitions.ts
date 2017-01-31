import { RouteInfo, RouteAnalysis } from "../../core"


export interface AnalyzerCommand {
    analyse(route: RouteInfo): RouteAnalysis[];
}

export function getMethodName(info:RouteInfo){
    let tokens = info.className.split(",")
    let method = `${tokens[0].trim()}.${info.methodMetaData.name}`
    let file = tokens[1].trim()
    return `[${method} ${file}]`;
}