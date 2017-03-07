import * as Core from "../core"
import { ValidatorImpl } from "../validator"
import { getInterceptors } from "./interceptor-decorator"

export class Factory {
    validatorCommands:Core.ValidatorCommand[]
    constructor(public facade: Core.Facade,
        public routeInfo: Core.RouteInfo) {
            this.validatorCommands = this.getValidatorCommands()
    }

    createController():Core.BaseController {
        try {
            return this.facade.dependencyResolver.resolve(this.routeInfo.classId)
        }
        catch (e) {
            throw new Error(`Can not instantiate [${this.routeInfo.classId}] as Controller`)
        }
    }

    createValidatorForValue(values:any[]){
        let validator = new ValidatorImpl(this.facade.metaDataStorage,this.validatorCommands)
        validator.setValue(values, this.routeInfo.classMetaData, this.routeInfo.methodMetaData.name)
        return validator
    }

    createInterceptors() {
        let controller = this.createController()
        let result: Core.Interceptor[] = []
        result = result.concat(this.getGlobalInterceptors())
        result = result.concat(this.getClassInterceptors(controller))
        result = result.concat(this.getMethodInterceptors(controller))
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

    private getMethodInterceptors(controller:Core.BaseController) {
        let interceptors = getInterceptors(controller, this.routeInfo.methodMetaData.name) || []
        let result: Core.Interceptor[] = []
        for (let intercept of interceptors) {
            if (typeof intercept == "string") {
                try {
                    let instance = this.facade.dependencyResolver.resolve(intercept)
                    result.push(instance)
                }
                catch (e) {
                    throw new Error(`Can not instantiate interceptor [${intercept}] on ${Core.getMethodName(this.routeInfo)}`)
                }
            }
            else {
                result.push(intercept)
            }
        }
        return result;
    }

    private getClassInterceptors(controller:Core.BaseController) {
        let interceptors = getInterceptors(controller)
        if (!interceptors) interceptors = []
        let result: Core.Interceptor[] = []
        for (let intercept of interceptors) {
            if (typeof intercept == "string") {
                try {
                    let instance = this.facade.dependencyResolver.resolve(intercept)
                    result.push(instance)
                }
                catch (e) {
                    throw new Error(`Can not instantiate interceptor [${intercept}] on [${this.routeInfo.qualifiedClassName}]`)
                }
            }
            else {
                result.push(intercept)
            }
        }
        return result;
    }

    private getGlobalInterceptors() {
        let result: Core.Interceptor[] = []
        if (!this.facade.interceptors) this.facade.interceptors = []
        for (let i = this.facade.interceptors.length - 1; i >= 0; i--) {
            let intercept = this.facade.interceptors[i]
            if (typeof intercept == "string") {
                try {
                    let instance = this.facade.dependencyResolver.resolve(intercept)
                    result.push(instance)
                }
                catch (e) {
                    throw new Error(`Can not instantiate interceptor [${intercept}] in global interceptors`)
                }
            }
            else {
                result.push(intercept)
            }
        }
        return result;
    }
}