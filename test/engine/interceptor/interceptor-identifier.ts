import * as Core from "../../../src/core"

const InterceptorMetadataKey = "kamboja:interceptor"

export function id(id:string) {
    return (...args: any[]) => {
        if (args.length == 1) {
            Reflect.defineMetadata(InterceptorMetadataKey, id, args[0])
        }
        else {
            Reflect.defineMetadata(InterceptorMetadataKey, id, args[0], args[1])
        }
    }
}

export function getId(target, methodName?: string) {
    if (!methodName) {
        return <string> Reflect.getMetadata(InterceptorMetadataKey, target.constructor)
    }
    else {
        return <string> Reflect.getMetadata(InterceptorMetadataKey, target, methodName)
    }
}
