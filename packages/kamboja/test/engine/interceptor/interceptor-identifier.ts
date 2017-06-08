import * as Core from "kamboja-core"

const InterceptorMetadataKey = "kamboja:middleware"

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
