import * as Kecubung from "kecubung"
import * as Core from "../core"
import { ValidatorCommand, getDecoratorName } from "./baseclasses"
import { ModelValidator } from "./model-validator"
import { RequiredValidator } from "./required-validator"

export class Validator implements Core.Validator {
    private static validators: ValidatorCommand[]
    static getValidators(){
        return Validator.validators;
    }
    
    static initValidators(idResolver:Core.IdentifierResolver){
        Validator.validators = [
            new ModelValidator(idResolver),
            new RequiredValidator()
        ]
    }

    private errors: Core.ValidationError[] = []

    constructor(private parameters: any[], private meta: Kecubung.MethodMetaData, private idResolver: Core.IdentifierResolver) { }

    valid() {
        for (let i = 0; i < this.meta.parameters.length; i++) {
            let value = this.parameters[i];
            let meta = this.meta.parameters[i]
            for (let decorator of meta.decorators) {
                let validator = Validator.getValidators().filter(x => getDecoratorName(x) == decorator.name)[0];
                if (validator) {
                    let errorMessage = validator.validate(value, meta)
                    if (errorMessage)
                        this.errors.push(...errorMessage)
                }
            }
        }
        return this.errors.length > 0;
    }


    getValidationErrors() {
        return this.errors;
    }
}