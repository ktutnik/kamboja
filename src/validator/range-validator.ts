import { ValidatorCommandBase, decoratorName } from "./baseclasses"
import { ValidationError } from "../core"
import * as Kecubung from "kecubung"
import * as Validator from "validator"

export class RangeValidator extends ValidatorCommandBase {

    @decoratorName("range")
    validate(value: any, metaData: Kecubung.ParameterMetaData | Kecubung.PropertyMetaData, parent?: string) {
        if (!value) return
        let fieldName = parent ? `${parent}.${metaData.name}` : metaData.name;
        let minValue = this.getParameter(metaData, 0, "Number")
        let maxValue = this.getParameter(metaData, 1, "Number")
        let customMessage = this.getParameter(metaData, 2, "String")
        if (typeof value == "number") {
            let numericValue = value;
            if (numericValue < minValue) {
                return [{
                    field: fieldName,
                    message: customMessage || `[${metaData.name}] must be greater than ${minValue}`
                }]
            }
            if (maxValue && numericValue > maxValue) {
                return [{
                    field: fieldName,
                    message: customMessage || `[${metaData.name}] must be less than ${maxValue}`
                }]
            }
        }
        else if(typeof value == "string") {
            let length = value.length;
            if (length < minValue){
                return [{
                    field: fieldName,
                    message: customMessage || `[${metaData.name}] length must be more than ${minValue} characters`
                }]
            }
            if (maxValue && length > maxValue) {
                return [{
                    field: fieldName,
                    message: customMessage || `[${metaData.name}] length must be less than ${maxValue} characters`
                }]
            }
        }
    }
}

