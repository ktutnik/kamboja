import * as Core from "../core"
import { ControllerExecutor } from "./controller-executor"
import "reflect-metadata"
import * as Kecubung from "kecubung"
import { getInterceptors } from "./interceptor-decorator"
import { ParameterBinder } from "../parameter-binder"

export class ControllerInvocation implements Core.Invocation {
    methodName: string
    classMetaData: Kecubung.ClassMetaData
    returnValue: Core.ActionResult;
    parameters: any[]
    interceptors: Core.Interceptor[] = []

    constructor(private facade: Core.Facade,
        private routeInfo: Core.RouteInfo,
        private request: Core.HttpRequest) {
        this.methodName = routeInfo.methodMetaData.name
        this.classMetaData = routeInfo.classMetaData
    }

    async execute(): Promise<void> {
        let parameterBinder = new ParameterBinder(this.routeInfo, this.request)
        this.parameters = parameterBinder.getParameters()
        let controllerExecutor = new ControllerExecutor(this.facade, this.routeInfo, this.request)
        this.interceptors = this.interceptors.concat(this.getGlobalInterceptors())
        this.interceptors = this.interceptors.concat(this.getClassInterceptors(controllerExecutor.controller))
        this.interceptors = this.interceptors.concat(this.getMethodInterceptors(controllerExecutor.controller))
        let executor = new ControllerExecutor(this.facade, this.routeInfo, this.request)
        this.returnValue = await executor.execute(this.parameters)
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