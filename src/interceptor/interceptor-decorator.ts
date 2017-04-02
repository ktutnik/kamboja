import * as Core from "../core"

export const InterceptorMetadataKey = "kamboja:interceptor"
export const InterceptorIdMetadataKey = "kamboja:interceptor:id"

export class InterceptorDecorator {
    add(interceptor: Core.RequestInterceptor | string) {
        return (...args: any[]) => {
            Core.MetaDataHelper.save(InterceptorMetadataKey, interceptor, args)
        }
    }
    id(id: string) {
        return (...args: any[]) => {
            Core.MetaDataHelper.save(InterceptorIdMetadataKey, id, args)
        }
    }

    
}
