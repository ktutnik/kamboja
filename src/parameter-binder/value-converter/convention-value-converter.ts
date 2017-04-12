import * as Kecubung from "kecubung"
import { BaseConverter, ConverterResult } from "./base-converter"
import { getRouteDetail } from "../../core"

export class ConventionValueConverter extends BaseConverter {
    convert(meta: Kecubung.ParameterMetaData, value: string): ConverterResult {
        if (typeof value == "undefined" || value == null) return this.exit(value);
        if (meta.name.indexOf("s") == 0 && this.isUppercase(meta.name[1]))
            return this.toString(value, meta)
        if ((meta.name.indexOf("i") == 0 || meta.name.indexOf("n") == 0)
            && this.isUppercase(meta.name[1]))
            return this.toNumber(value, meta)
        if (meta.name.indexOf("b") == 0 && this.isUppercase(meta.name[1]))
            return this.toBoolean(value, meta)
        return this.next()
    }

    isUppercase(char: string) {
        return char && char == char.toUpperCase()
    }

    toString(value, meta: Kecubung.ParameterMetaData) {
        if (typeof value == "object")
            throw new Error(`Expected parameter type of 'string'  but got object in [${meta.name}] ${getRouteDetail(this.routeInfo)}`)
        return this.exit(value.toString())
    }

    toNumber(value, meta: Kecubung.ParameterMetaData) {
        if (typeof value == "object")
            throw new Error(`Expected parameter type of 'number'  but got object in [${meta.name}] ${getRouteDetail(this.routeInfo)}`)
        return this.exit(parseInt(value))
    }

    toBoolean(value, meta: Kecubung.ParameterMetaData) {
        if (typeof value == "object")
            throw new Error(`Expected parameter type of 'boolean'  but got object in [${meta.name}] ${getRouteDetail(this.routeInfo)}`)
        return this.exit(value.toLowerCase() === "true")
    }
}