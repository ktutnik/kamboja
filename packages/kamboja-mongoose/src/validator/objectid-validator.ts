import { Validator, Core } from "kamboja"
import { Types } from "mongoose"
import * as Kecubung from "kecubung"

export class ObjectIdValidator extends Validator.ValidatorBase {
    @Validator.decoratorName("objectid")
    validate(arg: Core.FieldValidatorArg): Core.ValidationError[] {
        if (this.isEmpty(arg.value)) return
        if (!Types.ObjectId.isValid(arg.value)) {
            let argument = <Kecubung.PrimitiveValueMetaData>arg.decoratorArgs[0]
            let customMessage = argument && argument.value
            return [{
                field: arg.parentField ? `${arg.parentField}.${arg.field}` : arg.field,
                message: customMessage || `[${arg.field}] is not valid`
            }]
        }
    }
}