import * as Kecubung from "kecubung"
import { autoConvert } from "../baseclasses"
import { BaseConverter, ConverterResult } from "./base-converter"
import { DecoratedValueConverter } from "./decorated-value-converter"
import { DefaultValueConverter } from "./default-value-converter"
import { ConventionValueConverter } from "./convention-value-converter"
import * as Core from "../../core"



export function convert(routeInfo: Core.RouteInfo, meta: Kecubung.ParameterMetaData, value: any) {
    const Converters: BaseConverter[] = [
        new DecoratedValueConverter(routeInfo),
        new ConventionValueConverter(routeInfo),
        new DefaultValueConverter(routeInfo)
    ]
    for (let converter of Converters) {
        let result = converter.convert(meta, value)
        if (result.type == "Exit") return result.result;
    }
}