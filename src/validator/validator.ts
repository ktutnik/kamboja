import * as Kecubung from "kecubung"
import * as Core from "../core"
import { ValidatorCommandBase, getDecoratorName } from "./baseclasses"
import { ParameterValidator } from "./parameter-validator"
import { RequiredValidator } from "./required-validator"
import { MetaDataStorage } from "../metadata-storage"

export class Validator implements Core.Validator {

    private errors: Core.ValidationError[] = []

    constructor(private parameters: any[],
        private meta: Kecubung.MethodMetaData,
        private metaDataStorage: Core.MetaDataStorage,
        private validators: Core.ValidatorCommand[]) { }

    isValid() {
        let parameterValidator = new ParameterValidator(this.metaDataStorage, this.validators)
        for (let i = 0; i < this.meta.parameters.length; i++) {
            let value = this.parameters[i];
            let meta = this.meta.parameters[i]
            let result = parameterValidator.validate(value, meta)
            if (result) this.errors = this.errors.concat(result)
        }
        return this.errors.length > 0;
    }

    getValidationErrors() {
        return this.errors.length > 0 ? this.errors : undefined;
    }
}