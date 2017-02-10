import 'reflect-metadata'
import * as Kecubung from "kecubung"
import { ValidationError, ValidatorCommand } from "../core"


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
    model(qualifiedName: string) { return parameterDecorator; }
    creditCard(message?: string) { return parameterDecorator; }
    email(message?: string) { return parameterDecorator; }
    phone(message?: string) { return parameterDecorator; }
}

export abstract class ValidatorCommandBase implements ValidatorCommand {
    abstract validate(value: any, metaData: Kecubung.ParameterMetaData | Kecubung.PropertyMetaData, parent?:string): ValidationError[];

    protected getParameter(metaData: Kecubung.ParameterMetaData | Kecubung.PropertyMetaData, index: number, type: string) {
        let decoratorName = getDecoratorName(this)
        let decorator = metaData.decorators.filter(x => x.name == decoratorName)[0];
        let decoratorParameter = <Kecubung.PrimitiveValueMetaData>decorator.parameters[index]
        let customMessage;
        if (decoratorParameter && decoratorParameter.type == type)
            customMessage = decoratorParameter.value;
        return customMessage
    }
}