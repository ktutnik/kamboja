import { ValidatorCommandBase } from "../../../src/validator/baseclasses"
import { ValidationError } from "../../../src/core"
import * as Kecubung from "kecubung"

export class CustomValidation extends ValidatorCommandBase {
    validate(value: any, metaData: Kecubung.ParameterMetaData | Kecubung.PropertyMetaData, parent?: string): ValidationError[] {
        return null
    }
}
