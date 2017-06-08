import * as Core from "kamboja-core"
import * as Kecubung from "kecubung"
import { autoConvert } from "../baseclasses"

export interface ConverterResult {
    type: "Next" | "Exit",
    result?: any
}

export abstract class BaseConverter {
    constructor(protected routeInfo: Core.RouteInfo) { }

    abstract convert(meta: Kecubung.ParameterMetaData, value: string): ConverterResult

    next(): ConverterResult {
        return { type: "Next" }
    }

    exit(result?: any): ConverterResult {
        return { type: "Exit", result: result }
    }
}