import { ValidatorCommandBase, decoratorName } from "./baseclasses"
import { ValidationError } from "../core"
import * as Kecubung from "kecubung"

export class RequiredValidator extends ValidatorCommandBase {

    @decoratorName("required")
    validate(value: any, metaData: Kecubung.ParameterMetaData | Kecubung.PropertyMetaData) {
        if (!value) {
            let customMessage: string = this.getParameter(metaData, 0, "String")
            return [{
                field: metaData.name,
                message: customMessage || `[${metaData.name}] is required`
            }]
        }
    }
}

