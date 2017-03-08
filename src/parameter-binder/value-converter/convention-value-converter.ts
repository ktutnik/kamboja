import * as Kecubung from "kecubung"
import { BaseConverter, ConverterResult } from "./base-converter"
import { getMethodName } from "../../core"

export class ConventionValueConverter extends BaseConverter {
    convert(meta: Kecubung.ParameterMetaData, value: string): ConverterResult {
        if (typeof value == "undefined" || value == null) return this.exit(value);
        if (meta.name.indexOf("str") == 0 && this.isUppercase(meta.name[3]))
            return this.toString(value, meta)
        if ((meta.name.indexOf("num") == 0 || meta.name.indexOf("int") == 0)
            && this.isUppercase(meta.name[3]))
            return this.toNumber(value, meta)
        if (meta.name.indexOf("bool") == 0 && this.isUppercase(meta.name[4]))
            return this.toBoolean(value, meta)
        return this.next()
    }

    isUppercase(char: string) {
        return char == char.toUpperCase()
    }

    toString(value, meta: Kecubung.ParameterMetaData) {
        if (typeof value == "object")
            throw new Error(`Expected parameter type of 'string'  but got object in [${meta.name}] ${getMethodName(this.routeInfo)}`)
        return this.exit(value.toString())
    }

    toNumber(value, meta: Kecubung.ParameterMetaData) {
        if (typeof value == "object")
            throw new Error(`Expected parameter type of 'number'  but got object in [${meta.name}] ${getMethodName(this.routeInfo)}`)
        return this.exit(parseInt(value))
    }

    toBoolean(value, meta: Kecubung.ParameterMetaData) {
        if (typeof value == "object")
            throw new Error(`Expected parameter type of 'boolean'  but got object in [${meta.name}] ${getMethodName(this.routeInfo)}`)
        return this.exit(value.toLowerCase() === "true")
    }
}