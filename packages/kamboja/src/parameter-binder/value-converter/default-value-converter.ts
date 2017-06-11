import * as Kecubung from "kecubung"
import { autoConvert } from "./auto-converter"
import { BaseConverter, ConverterResult } from "./base-converter"

export class DefaultValueConverter extends BaseConverter {
    convert(meta: Kecubung.ParameterMetaData, value: string):ConverterResult {
        if(typeof value == "object") return this.exit(value)
        return this.exit(autoConvert(value))
    }
}