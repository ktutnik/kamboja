import * as Validator from "./validator"
import * as Core from "./core"
import * as Resolver from "./resolver"
import * as RouteGenerator from "./route-generator"
import * as Engine from "./engine"
import * as InterceptorDecorator from "./engine/interceptor-decorator"

export { Validator }
export { Core }
export { Resolver }
export { RouteGenerator }
export { Engine }
export { Kamboja } from "./kamboja"
export * from "./controller"

//decorators
export const interceptor = InterceptorDecorator.interceptor
export const val:Validator.ValidatorDecorator = new Validator.ValidatorDecorator();
export const internal = new Core.Decorator().internal;
export const http = new Core.HttpDecorator();

