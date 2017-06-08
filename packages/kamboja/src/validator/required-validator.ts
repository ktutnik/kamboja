import { ValidatorBase, decoratorName } from "./baseclasses"
import { ValidationError, FieldValidatorArg } from "kamboja-core"
import * as Kecubung from "kecubung"

export class RequiredValidator extends ValidatorBase {

    @decoratorName("required")
    validate(args: FieldValidatorArg) {
        if (this.isEmpty(args.value)) {
            let decoratorArg = <Kecubung.PrimitiveValueMetaData>args.decoratorArgs[0]
            let customMessage = decoratorArg && decoratorArg.value 
            return [{
                field: args.parentField ? `${args.parentField}.${args.field}` : args.field,
                message: customMessage || `[${args.field}] is required`
            }]
        }
    }
}

