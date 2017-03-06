import * as Core from "../core"
import { ValidatorImpl } from "../validator"
import { getInterceptors } from "./interceptor-decorator"

export class Container {
    public controller: Core.BaseController;
    public interceptors: Core.Interceptor[]

    constructor(public facade: Core.Facade,
        public routeInfo: Core.RouteInfo) {
        this.controller = this.createController()
        this.interceptors = this.getInterceptors()
    }

    private createController() {
        try {
            this.controller = this.facade.dependencyResolver.resolve(this.routeInfo.classId)
        }
        catch (e) {
            throw new Error(`Can not instantiate [${this.routeInfo.classId}] as Controller`)
        }
        this.controller.validator = this.getValidator();
        return this.controller;
    }

    private getValidator() {
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
        let validator = new ValidatorImpl(this.facade.metaDataStorage, commands)
        return validator
    }

    private getInterceptors() {
        let result: Core.Interceptor[] = []
        result = result.concat(this.getGlobalInterceptors())
        result = result.concat(this.getClassInterceptors())
        result = result.concat(this.getMethodInterceptors())
        return result;
    }

    private getMethodInterceptors() {
        let interceptors = getInterceptors(this.controller, this.routeInfo.methodMetaData.name) || []
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

    private getClassInterceptors() {
        let interceptors = getInterceptors(this.controller)
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