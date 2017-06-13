import * as Core from "kamboja-core"
import { ValidatorImpl } from "../validator"
import { Kamboja } from "../kamboja"
import { Middleware } from "../index"
import { ControllerFactory } from "./controller-factory"


export class MiddlewareFactory {
    validatorCommands: Core.ValidatorCommand[]
    constructor(private facade: Core.Facade,
        private controller?: Core.BaseController,
        private routeInfo?: Core.RouteInfo) { }

    createMiddlewares() {
        let result: Core.Middleware[] = []
        result = result.concat(this.getGlobalMiddlewares())
        if (this.routeInfo) {
            result = result.concat(this.getClassMiddlewares(this.controller))
            result = result.concat(this.getMethodMiddlewares(this.controller))
        }
        return result;
    }

    getMethodMiddlewares(controller: Core.BaseController) {
        let middlewares = Middleware.getMiddlewares(controller, this.routeInfo.methodMetaData.name) || []
        let result: Core.Middleware[] = []
        for (let middleware of middlewares) {
            if (typeof middleware == "string") {
                try {
                    let instance = this.facade.dependencyResolver.resolve<Core.Middleware>(middleware)
                    result.push(instance)
                }
                catch (e) {
                    throw new Error(`Can not instantiate middleware [${middleware}] on ${Core.getRouteDetail(this.routeInfo)}`)
                }
            }
            else {
                result.push(middleware)
            }
        }
        return result;
    }

    getClassMiddlewares(controller: Core.BaseController) {
        let middlewares = Middleware.getMiddlewares(controller)
        if (!middlewares) middlewares = []
        let result: Core.Middleware[] = []
        for (let middleware of middlewares) {
            if (typeof middleware == "string") {
                try {
                    let instance = this.facade.dependencyResolver.resolve<Core.Middleware>(middleware)
                    result.push(instance)
                }
                catch (e) {
                    throw new Error(`Can not instantiate middleware [${middleware}] on [${this.routeInfo.qualifiedClassName}]`)
                }
            }
            else {
                result.push(middleware)
            }
        }
        return result;
    }

    getGlobalMiddlewares() {
        let result: Core.Middleware[] = []
        if (!this.facade.middlewares) this.facade.middlewares = []
        for (let i = this.facade.middlewares.length - 1; i >= 0; i--) {
            let middleware = this.facade.middlewares[i]
            if (typeof middleware == "string") {
                try {
                    let instance = this.facade.dependencyResolver.resolve<Core.Middleware>(middleware)
                    result.push(instance)
                }
                catch (e) {
                    throw new Error(`Can not instantiate middleware [${middleware}] in global middlewares`)
                }
            }
            else {
                result.push(middleware)
            }
        }
        return result;
    }
}