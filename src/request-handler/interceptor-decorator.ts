import * as Core from "../core"

const InterceptorMetadataKey = "kamboja:interceptor"

export function interceptor(interceptor: Core.Interceptor | string) {
    return (...args: any[]) => {
        if (args.length == 1) {
            let interceptors: (Core.Interceptor | string)[] = Reflect.getMetadata(InterceptorMetadataKey, args[0]) || []
            interceptors.push(interceptor);
            Reflect.defineMetadata(InterceptorMetadataKey, interceptors, args[0])
        }
        else if (args.length == 3) {
            let interceptors: (Core.Interceptor | string)[] = Reflect.getMetadata(InterceptorMetadataKey, args[0], args[1]) || []
            interceptors.push(interceptor);
            Reflect.defineMetadata(InterceptorMetadataKey, interceptors, args[0], args[1])
        }
        else {
            throw new Error("Interceptors only allowed on class and method")
        }
    }
}

export function getInterceptors(target, methodName?: string) {
    if (!methodName) {
        let interceptors: (Core.Interceptor | string)[] = Reflect.getMetadata(InterceptorMetadataKey, target.constructor) || []
        return interceptors
    }
    else {
        let interceptors: (Core.Interceptor | string)[] = Reflect.getMetadata(InterceptorMetadataKey, target, methodName) || []
        return interceptors
    }
}