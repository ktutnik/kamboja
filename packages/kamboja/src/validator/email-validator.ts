import { ValidatorBase, decoratorName } from "./baseclasses"
import { ValidationError, FieldValidatorArg } from "kamboja-core"
import * as Kecubung from "kecubung"
import * as Validator from "validator"

export class EmailValidator extends ValidatorBase {

    @decoratorName("email")
    validate(args:FieldValidatorArg) {
        if(this.isEmpty(args.value)) return
        if (!Validator.isEmail(args.value.toString())) {
            let argument = <Kecubung.PrimitiveValueMetaData>args.decoratorArgs[0]
            let customMessage = argument && argument.value
            return [{
                field: args.parentField ? `${args.parentField}.${args.field}` : args.field,
                message: customMessage || `[${args.field}] is not a valid email address`
            }]
        }
    }
}

