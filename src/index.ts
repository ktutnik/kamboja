import * as Validator from "./validator"
import * as Core from "./core"
import * as Resolver from "./resolver"
import * as RouteGenerator from "./route-generator"
import * as Engine from "./engine"
import * as Kecubung from "kecubung"
import * as Interceptor from "./interceptor"

export { Validator }
export { Core }
export { Resolver }
export { RouteGenerator }
export { Engine }
export { Interceptor }
export { ApiActionResult, ApiController, Controller, FileActionResult, JsonActionResult, RedirectActionResult, ViewActionResult, HttpStatusError } from "./controller"
export { Kamboja } from "./kamboja"
export { MetaDataLoader } from "./metadata-loader/metadata-loader"

//decorators
export const interceptor:Interceptor.InterceptorDecorator = new Interceptor.InterceptorDecorator()
export const val: Validator.ValidatorDecorator = new Validator.ValidatorDecorator();
export const internal = new Core.Decorator().internal;
export const http = new Core.HttpDecorator();
export function authorize(role?:string|string[]){
    return interceptor.add(new Interceptor.AuthorizeInterceptor(role))
}
