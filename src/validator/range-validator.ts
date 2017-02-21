import { ValidatorBase, decoratorName } from "./baseclasses"
import { ValidationError, FieldValidatorArg } from "../core"
import * as Kecubung from "kecubung"
import * as Validator from "validator"

export class RangeValidator extends ValidatorBase {

    @decoratorName("range")
    validate(args:FieldValidatorArg) {
        if (this.isEmpty(args.value)) return
        let fieldName = args.parentField ? `${args.parentField}.${args.field}` : args.field
        let minValue:number, maxValue: number, customMessage: string;
        minValue = (<Kecubung.PrimitiveValueMetaData>args.decoratorArgs[0]).value
        if(args.decoratorArgs[1]) maxValue = (<Kecubung.PrimitiveValueMetaData>args.decoratorArgs[1]).value
        if(args.decoratorArgs[2]) customMessage = (<Kecubung.PrimitiveValueMetaData>args.decoratorArgs[2]).value
        if (typeof args.value == "number") {
            let numericValue = args.value;
            if (numericValue < minValue) {
                return [{
                    field: fieldName,
                    message: customMessage || `[${args.field}] must be greater than ${minValue}`
                }]
            }
            if (maxValue && numericValue > maxValue) {
                return [{
                    field: fieldName,
                    message: customMessage || `[${args.field}] must be less than ${maxValue}`
                }]
            }
        }
        else if(typeof args.value == "string") {
            let length = args.value.length;
            if (length < minValue){
                return [{
                    field: fieldName,
                    message: customMessage || `[${args.field}] length must be more than ${minValue} characters`
                }]
            }
            if (maxValue && length > maxValue) {
                return [{
                    field: fieldName,
                    message: customMessage || `[${args.field}] length must be less than ${maxValue} characters`
                }]
            }
        }
    }
}

