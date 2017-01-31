import * as Val from "validator"

export interface ValidationError {
    field: string,
    message: string
}

export type ValidationType = "Number" | "String" | "Boolean" | "Array" | "Object"

export interface ValidationRule {
    type: ValidationType
}

export interface ArrayValidationRule extends ValidationRule {
    type: "Array",
    childrenType: ValidationType
}

export interface ObjectValidationRule extends ValidationRule {
    type: "Object",
    children: ValidationRule[]
}

export interface ValidationMessage {
    success: boolean,
    errorMessage?: ValidationError[]
}

export interface ValidatorCommand {
    validate(data): ValidationMessage
}

export class Validator {
    commands: { [key: string]: ValidatorCommand }
    constructor() {

    }
    
    validate(data, rule: ValidationRule): ValidationMessage {
        return { success: true };
    }
}