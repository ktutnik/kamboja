import * as Kecubung from "kecubung"
import * as Core from "../core"
import { ValidatorCommandBase, getDecoratorName } from "./baseclasses"
import { ParameterValidator } from "./parameter-validator"
import { RequiredValidator } from "./required-validator"
import { EmailValidator } from "./email-validator"
import { RangeValidator } from "./range-validator"
import { InMemoryMetaDataStorage } from "../metadata-storage"

export class Validator implements Core.Validator {
    private parameters: any[]
    private meta: Kecubung.MethodMetaData
    private errors: Core.ValidationError[] = []
    private validators: Core.ValidatorCommand[]

    constructor(private metaDataStorage: Core.MetaDataStorage,
        validators: Core.ValidatorCommand[]) { 
            if(!validators) validators = []
            this.validators = validators;
            this.validators.push(new EmailValidator())
            this.validators.push(new RangeValidator())
            this.validators.push(new RequiredValidator())
        }

    setValue(parameters: any[],
        meta: Kecubung.MethodMetaData) {
        this.parameters = parameters
        this.meta = meta
    }

    isValid() {
        let parameterValidator = new ParameterValidator(this.metaDataStorage, this.validators)
        for (let i = 0; i < this.meta.parameters.length; i++) {
            let value = this.parameters[i];
            let meta = this.meta.parameters[i]
            let result = parameterValidator.validate(value, meta)
            if (result) this.errors = this.errors.concat(result)
        }
        return this.errors.length == 0;
    }

    getValidationErrors() {
        return this.errors.length > 0 ? this.errors : undefined;
    }
}