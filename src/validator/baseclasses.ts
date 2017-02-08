import 'reflect-metadata'

export interface ValidatorCommand {
    validate()
}

export interface ValidatorParams {
    required?: boolean
    message?: string
    max?:any
    min?:any
}

const MetaDataKey = "kamboja:Validator"

function parameterDecorator(target: any, propertyKey: string, index: number){}

export class Validator {
    model(qualifiedName:string, opt?: boolean | ValidatorParams) {
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

