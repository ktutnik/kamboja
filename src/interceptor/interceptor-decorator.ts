import * as Core from "../core"

export const InterceptorMetadataKey = "kamboja:interceptor"
export const InterceptorIdMetadataKey = "kamboja:interceptor:id"

export class InterceptorDecorator {
    add(interceptor: Core.RequestInterceptor | string | Core.InterceptorFunction) {
        let intercept: Core.RequestInterceptor | string;
        if(typeof interceptor == "function"){
            intercept = {
                intercept: interceptor
            }
        }
        else {
            intercept = interceptor
        }
        return (...args: any[]) => {
            Core.MetaDataHelper.save(InterceptorMetadataKey, intercept, args)
        }
    }
    id(id: string) {
        return (...args: any[]) => {
            Core.MetaDataHelper.save(InterceptorIdMetadataKey, id, args)
        }
    }

    
}
