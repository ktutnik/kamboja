import * as Core from "../core"
import { getInterceptors } from "./interceptor-decorator"

export class InterceptorBuilder {
    constructor(private controller: Core.Controller,
        private facade: Core.Facade,
        private routeInfo: Core.RouteInfo) { }

    getInterceptors() {
        let result:Core.Interceptor[] = []
        result = result.concat(this.getGlobalInterceptors())
        result = result.concat(this.getClassInterceptors(this.controller))
        result = result.concat(this.getMethodInterceptors(this.controller))
        return result;
    }

    private getMethodInterceptors(controller: Core.Controller) {
        let interceptors = getInterceptors(controller, this.routeInfo.methodMetaData.name)
        let result: Core.Interceptor[] = []
        for (let intercept of interceptors) {
            if (typeof intercept == "string") {
                try {
                    let instance = this.facade.dependencyResolver.resolve(intercept)
                    result.push(instance)
                }
                catch (e) {
                    throw new Error(`Can not instantiate interceptor [${intercept}] on [${this.routeInfo.qualifiedClassName}] on method [${Core.getMethodName(this.routeInfo)}]`)
                }
            }
            else {
                result.push(intercept)
            }
        }
        return result;
    }

    private getClassInterceptors(controller: Core.Controller) {
        let interceptors = getInterceptors(controller)
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
        for (let intercept of this.facade.interceptors) {
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