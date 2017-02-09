import { ValidatorCommand, ValidatorParams, transform } from "./baseclasses"
import { ValidationError } from "../core"
import * as Kecubung from "kecubung"

export class RequiredValidator implements ValidatorCommand {
    constructor(private value: any, private fieldName: string, private decoratorParameters: Kecubung.ValueMetaData[]) { }

    validate() {
        //decorator parameter can be multiple, search for type boolean or object
        let parameter = this.decoratorParameters.filter(x => x.type == "Boolean" || x.type == "Object")[0]
        if (!parameter) return;

        let option = transform(parameter)
        if (option.required && !this.value) {
            return [{
                field: this.fieldName,
                message: option.message || `'${this.fieldName}' is required`
            }]
        }
    }
}

