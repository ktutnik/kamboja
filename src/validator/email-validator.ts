import { ValidatorCommandBase, decoratorName } from "./baseclasses"
import { ValidationError } from "../core"
import * as Kecubung from "kecubung"
import * as Validator from "validator"

export class EmailValidator extends ValidatorCommandBase {

    @decoratorName("email")
    validate(value: any, metaData: Kecubung.ParameterMetaData | Kecubung.PropertyMetaData, parent?:string) {
        if (!Validator.isEmail(value.toString())) {
            let customMessage: string = this.getParameter(metaData, 0, "String")
            return [{
                field: parent ? `${parent}.${metaData.name}` : metaData.name,
                message: customMessage || `[${metaData.name}] is not a valid email address`
            }]
        }
    }
}

