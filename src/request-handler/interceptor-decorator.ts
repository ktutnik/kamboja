import * as Core from "../core"

const InterceptorMetadataKey = "kamboja:interceptor"

export function interceptor(interceptor: Core.Interceptor | string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let interceptors: (Core.Interceptor | string)[] = Reflect.getMetadata(InterceptorMetadataKey, target, propertyKey) || []
        interceptors.push(interceptor);
        Reflect.defineMetadata(InterceptorMetadataKey, interceptors, target, propertyKey)
    }
}

export function getInterceptors(target, methodName: string) {
    let interceptors: (Core.Interceptor | string)[] = Reflect.getMetadata(InterceptorMetadataKey, target, methodName) || []
    return interceptors
}