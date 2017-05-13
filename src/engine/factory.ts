import * as Core from "../core"
import { ValidatorImpl } from "../validator"
import { Kamboja } from "../kamboja"
import { Middleware } from "../index"


export class ControllerFactory {
    validatorCommands: Core.ValidatorCommand[]
    constructor(public facade: Core.Facade, public routeInfo?: Core.RouteInfo) {
        this.validatorCommands = this.getValidatorCommands()
    }

    createController(): Core.BaseController {
        try {
            return this.facade.dependencyResolver.resolve(this.routeInfo.classId)
        }
        catch (e) {
            throw new Error(`Can not instantiate [${this.routeInfo.classId}] as Controller.\n\t Inner message: ${e.message}`)
        }
    }

    createValidatorForValue(values: any[]) {
        let validator = new ValidatorImpl(this.facade.metaDataStorage, this.validatorCommands)
        validator.setValue(values, this.routeInfo.classMetaData, this.routeInfo.methodMetaData.name)
        return validator
    }

    createMiddlewares() {
        let result: Core.Middleware[] = []
        result = result.concat(this.getGlobalMiddlewares())
        if (this.routeInfo) {
            let controller = this.createController()
            result = result.concat(this.getClassMiddlewares(controller))
            result = result.concat(this.getMethodMiddlewares(controller))
        }
        return result;
    }

    private getValidatorCommands() {
        let commands: Core.ValidatorCommand[] = [];
        if (this.facade.validators) {
            this.facade.validators.forEach(x => {
                if (typeof x == "string") {
                    try {
                        let validator = this.facade.dependencyResolver.resolve(x)
                        commands.push(validator)
                    }
                    catch (e) {
                        throw new Error(`Can not instantiate custom validator [${x}]`)
                    }
                }
                else commands.push(x)
            })
        }
        return commands
    }

    private getMethodMiddlewares(controller: Core.BaseController) {
        let middlewares = Middleware.getMiddlewares(controller, this.routeInfo.methodMetaData.name) || []
        let result: Core.Middleware[] = []
        for (let middleware of middlewares) {
            if (typeof middleware == "string") {
                try {
                    let instance = this.facade.dependencyResolver.resolve(middleware)
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

    private getClassMiddlewares(controller: Core.BaseController) {
        let middlewares = Middleware.getMiddlewares(controller)
        if (!middlewares) middlewares = []
        let result: Core.Middleware[] = []
        for (let middleware of middlewares) {
            if (typeof middleware == "string") {
                try {
                    let instance = this.facade.dependencyResolver.resolve(middleware)
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
                    let instance = this.facade.dependencyResolver.resolve(middleware)
                    result.push(instance)
                }
                catch (e) {
                    throw new Error(`Can not instantiate middleware [${middleware}] in global middlewares`)
                }
            }
            else if (typeof middleware == "function") {
                result.push({ execute: middleware })
            }
            else {
                result.push(middleware)
            }
        }
        return result;
    }
}