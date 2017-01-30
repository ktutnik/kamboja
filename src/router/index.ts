import { RouteInfo } from "../core"

export interface RouteAnalysis {
    type: "Error" | "Warning"
    message: string
}

export interface AnalyzerCommand {
    analyse(route: RouteInfo): RouteAnalysis[];
}

export function getMethodName(info:RouteInfo){
    let tokens = info.className.split(",")
    let method = `${tokens[0].trim()}.${info.methodMetaData.name}`
    let file = tokens[1].trim()
    return `[${method} ${file}]`;
}