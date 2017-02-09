import 'reflect-metadata'
import * as Kecubung from "kecubung"
import { ValidationError } from "../core"

export interface ValidatorCommand {
    validate(): ValidationError[]
}

export interface ValidatorParams {
    required?: boolean
    message?: string
    max?: any
    min?: any
}

export type ValidationType = keyof ValidatorDecorator;

const MetaDataKey = "kamboja:Validator"

export function parameterDecorator(target: any, propertyKey: string, index: any) { }

export class ValidatorDecorator {
    model(qualifiedName: string, opt?: boolean | ValidatorParams) {
        return parameterDecorator
    }

    creditCard(opt?: boolean | ValidatorParams) {
        return parameterDecorator
    }

    email(opt?: boolean | ValidatorParams) {
        return parameterDecorator
    }

    phone(opt?: boolean | ValidatorParams) {
        return parameterDecorator
    }

    string(opt?: boolean | ValidatorParams) {
        return parameterDecorator
    }

    number(opt?: boolean | ValidatorParams) {
        return parameterDecorator
    }

    boolean(opt?: boolean | ValidatorParams) {
        return parameterDecorator
    }

    date(opt?: boolean | ValidatorParams) {
        return parameterDecorator
    }
}

export function transform(meta: Kecubung.ValueMetaData): ValidatorParams {
    if (meta.type == "Boolean") {
        return {
            required: (<Kecubung.PrimitiveValueMetaData>meta).value
        }
    }
    else {
        let option = <Kecubung.ObjectValueMetaData>meta;
        let result: any = {}
        for (let prop of option.properties) {
            result[prop.name] = (<Kecubung.PrimitiveValueMetaData>prop).value
        }
        return result;
    }
}