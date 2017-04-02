import * as Core from "../core"
import { InterceptorDecorator, InterceptorIdMetadataKey, InterceptorMetadataKey } from "./interceptor-decorator"

export { AuthorizeInterceptor } from "./authorize-interceptor"
export { InterceptorDecorator }

export function getInterceptors(target, methodName?: string) {
    return Core.MetaDataHelper.get<(Core.RequestInterceptor | string)>(InterceptorMetadataKey, target, methodName)
}

export function getId(target) {
    let result = Core.MetaDataHelper.get<string>(InterceptorIdMetadataKey, target)
    return result ? result[0] : undefined
}