

export class ValidatorDecorator{
    shortid(message?: string) { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
    objectid(message?: string) { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
}