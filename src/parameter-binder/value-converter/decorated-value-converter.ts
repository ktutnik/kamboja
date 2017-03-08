import * as Kecubung from "kecubung"
import { autoConvert } from "../baseclasses"
import { BaseConverter, ConverterResult } from "./base-converter"
import {getMethodName} from "../../core"

/*
@val.type("string")
@val.type("number")
@val.type("boolean")
*/
const AcceptedTypes = ["string", "number", "boolean"]
export class DecoratedValueConverter extends BaseConverter {

    convert(meta: Kecubung.ParameterMetaData, value: string): ConverterResult {
        let decorators = meta.decorators && meta.decorators
            .filter(x => this.filterTypes(x))
        if (!decorators || decorators.length == 0) return this.next()
        if (typeof value == "undefined" || value == null) return this.exit(value);
        let type = this.getParameter(decorators[0]);
        if (typeof value == "object") 
            throw new Error(`Expected parameter type of [@val.type('${type}') ${meta.name}] but got object in ${getMethodName(this.routeInfo)}`)
        switch (type) {
            case "string":
                return this.exit(value.toString())
            case "number":
                return this.exit(parseInt(value))
            case "boolean":
                return this.exit(value.toLowerCase() === "true")
        }
    }

    filterTypes(x: Kecubung.DecoratorMetaData) {
        return x.name == "type" && AcceptedTypes.some(y => this.getParameter(x) == y)
    }

    getParameter(x: Kecubung.DecoratorMetaData) {
        return (<Kecubung.PrimitiveValueMetaData>x.parameters[0])
            .value.toString().toLowerCase()
    }
}