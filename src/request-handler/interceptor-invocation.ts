import * as Core from "../core"
import { ControllerExecutor } from "./controller-executor"
import "reflect-metadata"
import * as Kecubung from "kecubung"
import { getInterceptors } from "./interceptor-decorator"
import { ParameterBinder } from "../parameter-binder"

export class InterceptorInvocation implements Core.Invocation {
    methodName: string
    classMetaData: Kecubung.ClassMetaData
    returnValue: Core.ActionResult;
    parameters: any[]
    interceptors: Core.Interceptor[]

    constructor(private invocation: Core.Invocation, private interceptor: Core.Interceptor) { }

    async execute(): Promise<void> {
        await this.interceptor.intercept(this.invocation)
        this.classMetaData = this.invocation.classMetaData
        this.methodName = this.invocation.methodName
        this.returnValue = this.invocation.returnValue
        this.parameters = this.invocation.parameters
        this.interceptors = this.invocation.interceptors;
    }
}

export class ControllerInvocation implements Core.Invocation {
    methodName: string
    classMetaData: Kecubung.ClassMetaData
    returnValue: Core.ActionResult;
    parameters: any[]
    interceptors: Core.Interceptor[]

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
        this.interceptors = this.getAllInterceptors(controllerExecutor.controller)
        let executor = new ControllerExecutor(this.facade, this.routeInfo, this.request)
        this.returnValue = await executor.execute(this.parameters)
    }

    private getAllInterceptors(controller: Core.Controller) {
        let interceptors = this.facade.interceptors;
        let controllerInterceptors = getInterceptors(controller, this.routeInfo.methodMetaData.name)
        interceptors = interceptors.concat(controllerInterceptors)
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
}