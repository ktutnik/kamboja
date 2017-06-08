import { ValidatorBase, decoratorName } from "../../../src/validator/baseclasses"
import { ValidationError, FieldValidatorArg } from "kamboja-core"
import * as Kecubung from "kecubung"

export class CustomValidation extends ValidatorBase {

    @decoratorName("customValidation")
    validate(arg:FieldValidatorArg): ValidationError[] {
        return [{
            field: "any.field",
            message: "This is error"
        }]
    }
}
