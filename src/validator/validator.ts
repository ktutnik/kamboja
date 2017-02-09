import * as Kecubung from "kecubung"
import * as Core from "../core"
import { ValidatorCommand, ValidationType, transform } from "./baseclasses"
import { ModelValidator } from "./model-validator"

export class Validator implements Core.Validator {
    private validators: ValidationType[] = ["model", "creditCard", "boolean", "date", "email", "number", "phone", "string"]
    private errors: Core.ValidationError[] = []

    constructor(private parameters: any[], private meta: Kecubung.MethodMetaData, private idResolver: Core.IdentifierResolver) { }

    valid() {
        for (let i = 0; i < this.meta.parameters.length; i++) {
            let parameter = this.meta.parameters[i];
            if (parameter.decorators && parameter.decorators.length > 0) {
                let decorator = parameter.decorators.filter(x => this.validators.some(y => y == x.name))[0]
                if (decorator) this.validate(this.parameters[i], parameter.name, decorator)
            }
        }
        return this.errors.length > 0;
    }

    private validate(value: any, fieldName:string, decorator: Kecubung.DecoratorMetaData) {
        let type: ValidationType = <ValidationType>decorator.name;
        switch (type) {
            case "model":
                let validator = new ModelValidator(value, fieldName, decorator.parameters, this.idResolver)
                let errors = validator.validate();
                if(errors) this.errors.push(...errors)
            
        }
    }

    getValidationErrors() {
        return []
    }
}