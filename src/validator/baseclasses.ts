import 'reflect-metadata'
import * as Kecubung from "kecubung"
import { ValidationError, FieldValidatorArg, ValidatorCommand } from "../core"
import * as Validator from "validator"
const MetaDataKey = "kamboja:Validator"

export function decoratorName(decoratorName: string) {
    return (target: any, propertyKey: string, index: any) => {
        Reflect.defineMetadata(MetaDataKey, decoratorName, target)
    }
}

export function getDecoratorName(target) {
    return <string>Reflect.getMetadata(MetaDataKey, target)
}

export function parameterDecorator(...params) { }

export class ValidatorDecorator {
    required(message?: string) { return parameterDecorator; }
    range(min: number, max?: number, message?: string) { return parameterDecorator; }
    type(qualifiedName: string) { return parameterDecorator; }
    email(message?: string) { return parameterDecorator; }
}

export interface ParametersValidatorArg {
    type: "ParametersValidator",
    parameterValues: any[]
    parentField?: string
    methodName: string,
    classInfo: Kecubung.ClassMetaData
}

export interface PropertiesValidatorArg {
    type: "PropertiesValidator",
    classInstance: any
    parentField?: string
    classInfo: Kecubung.ClassMetaData
    isArray: boolean
}

export class ValidatorBase implements ValidatorCommand {
    public validators: ValidatorCommand[]

    validate(args: FieldValidatorArg): ValidationError[] {
        return null;
    }

    isEmpty(value: any) {
        return typeof value == "undefined"
            || value == null
            || (typeof value == "string" && value.trim() == "")
    }

    protected validateFields(arg: ParametersValidatorArg | PropertiesValidatorArg): ValidationError[] {
        if (arg.type == "PropertiesValidator") {
            let result: ValidationError[] = []
            for (let property of arg.classInfo.properties) {
                if (arg.isArray) {
                    if(!Array.isArray(arg.classInstance))
                        return [{
                            field: arg.parentField,
                            message: `[${arg.parentField}] must be a type of Array`
                        }]
                    let instances: any[] = arg.classInstance;
                    for (let i = 0; i < instances.length; i++) {
                        let instance = instances[i]
                        let value = instance[property.name]
                        let valResult = this.useValidators({
                            decorators: property.decorators,
                            value: value,
                            field: property.name,
                            parentField: `${arg.parentField}[${i}]` ,
                            classInfo: arg.classInfo
                        })
                        result.push(...valResult)
                    }
                }
                else {
                    let value = arg.classInstance[property.name]
                    let valResult = this.useValidators({
                        decorators: property.decorators,
                        value: value,
                        field: property.name,
                        parentField: arg.parentField,
                        classInfo: arg.classInfo
                    })
                    result.push(...valResult)
                }

            }
            return result.length == 0 ? undefined : result;
        }
        else {
            let result: ValidationError[] = []
            let method = arg.classInfo.methods.filter(x => x.name == arg.methodName)[0]
            for (let i = 0; i < method.parameters.length; i++) {
                let parameterMetadata = method.parameters[i]
                let value = arg.parameterValues[i]
                let valResult = this.useValidators({
                    decorators: parameterMetadata.decorators,
                    classInfo: arg.classInfo,
                    field: parameterMetadata.name,
                    parentField: arg.parentField,
                    value: value
                })
                result.push(...valResult)
            }
            return result.length == 0 ? undefined : result;
        }
    }

    private useValidators(arg: {
        decorators: Kecubung.DecoratorMetaData[],
        value: any,
        field: string,
        parentField?: string,
        classInfo: Kecubung.ClassMetaData
    }) {
        let result: ValidationError[] = []
        if (!arg.decorators) return
        for (let decorator of arg.decorators) {
            let validators = this.validators.filter(x => getDecoratorName(x) == decorator.name)
            for (let validator of validators) {
                let validationResult = validator.validate({
                    classInfo: arg.classInfo,
                    decoratorArgs: decorator.parameters,
                    field: arg.field,
                    parentField: arg.parentField ? `${arg.parentField}` : arg.parentField,
                    value: arg.value
                })
                result.push(...validationResult)
            }
        }
        return result
    }
}