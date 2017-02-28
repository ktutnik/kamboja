import * as Core from "../core"
import { getInterceptors } from "./interceptor-decorator"

export class InterceptorBuilder {
    constructor(private controller: Core.BaseController,
        private facade: Core.Facade,
        private routeInfo: Core.RouteInfo) { }

    getInterceptors() {
        let result:Core.Interceptor[] = []
        result = result.concat(this.getGlobalInterceptors())
        result = result.concat(this.getClassInterceptors())
        result = result.concat(this.getMethodInterceptors())
        return result;
    }

    getMethodInterceptors() {
        let interceptors = getInterceptors(this.controller, this.routeInfo.methodMetaData.name)
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

    getClassInterceptors() {
        let interceptors = getInterceptors(this.controller)
        if(!interceptors) interceptors = []
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

    getGlobalInterceptors() {
        let result: Core.Interceptor[] = []
        if(!this.facade.interceptors) this.facade.interceptors = []
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