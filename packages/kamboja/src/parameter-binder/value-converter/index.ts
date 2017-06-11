import * as Kecubung from "kecubung"
import { BaseConverter } from "./base-converter"
import { DecoratedValueConverter } from "./decorated-value-converter"
import { DefaultValueConverter } from "./default-value-converter"
import { ConventionValueConverter } from "./convention-value-converter"
import * as Core from "kamboja-core"


export function convert(routeInfo: Core.RouteInfo, name:string, value: any) {
    const Converters: BaseConverter[] = [
        new DecoratedValueConverter(routeInfo),
        new ConventionValueConverter(routeInfo),
        new DefaultValueConverter(routeInfo)
    ]
    for (let converter of Converters) {
        let result = converter.convert(routeInfo.methodMetaData.parameters.filter(x => x.name == name)[0], value)
        if (result.type == "Exit") return result.result;
    }
}