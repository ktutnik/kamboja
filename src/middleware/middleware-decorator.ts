import * as Core from "../core"

export const MiddlewareMetadataKey = "kamboja:middleware"
export const MiddlewareIdMetadataKey = "kamboja:middleware:id"

export class MiddlewareDecorator {
    add(middleware: Core.Middleware | string | Core.MiddlewareFunction) {
        let mdw: Core.Middleware | string;
        if(typeof middleware == "function"){
            mdw = {
                execute: middleware
            }
        }
        else {
            mdw = middleware
        }
        return (...args: any[]) => {
            Core.MetaDataHelper.save(MiddlewareMetadataKey, mdw, args)
        }
    }
    id(id: string) {
        return (...args: any[]) => {
            Core.MetaDataHelper.save(MiddlewareIdMetadataKey, id, args)
        }
    }

    
}
