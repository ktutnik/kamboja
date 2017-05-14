import * as Core from "../core"

export const MiddlewareMetadataKey = "kamboja:middleware"
export const MiddlewareIdMetadataKey = "kamboja:middleware:id"

export class MiddlewareDecorator {
    add(middleware: Core.Middleware | string ) {
        return (...args: any[]) => {
            Core.MetaDataHelper.save(MiddlewareMetadataKey, middleware, args)
        }
    }
    id(id: string) {
        return (...args: any[]) => {
            Core.MetaDataHelper.save(MiddlewareIdMetadataKey, id, args)
        }
    }

    
}
