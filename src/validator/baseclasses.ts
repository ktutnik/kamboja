import 'reflect-metadata'

export interface ValidatorCommand {
    validate()
}

export interface ValidatorParams {
    type: "Model" | "CreditCard" | "Email" | "Phone" | "String" | "Number" | "Boolean" | "Date"
    required?: boolean,
    message?: string
}

const MetaDataKey = "kamboja:Validator"

export class Validator {
    static getMetaData(target: any, methodName: string, index: number) {
        let key = `${methodName}(${index})`
        return Reflect.getMetadata(MetaDataKey, target, key)
    }

    private createDescriptor(metaDataKey: string, params: ValidatorParams) {
        return (target: any, methodName: string, index: number) => {
            let key = `${methodName}(${index})`
            Reflect.defineMetadata(MetaDataKey, params, target, key)
        }
    }

    model(qualifiedName: string, required?: boolean) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

        }
    }

    creditCard(required?: boolean) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

        }
    }

    email(required?: boolean) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        }
    }

    phone(required?: boolean) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        }
    }

    string(required?: boolean, max?: number, min?: number) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        }
    }

    number(required?: boolean, max?: number, min?: number) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        }
    }

    boolean(required?: boolean) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        }
    }

    date(required?: boolean, max?: number, min?: number) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        }
    }
}