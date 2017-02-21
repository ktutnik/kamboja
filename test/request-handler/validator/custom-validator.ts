import { ValidatorBase } from "../../../src/validator/baseclasses"
import { ValidationError, FieldValidatorArg } from "../../../src/core"
import * as Kecubung from "kecubung"

export class CustomValidation extends ValidatorBase {
    validate(arg:FieldValidatorArg): ValidationError[] {
        return null
    }
}
