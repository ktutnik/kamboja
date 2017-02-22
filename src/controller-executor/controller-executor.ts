import * as Core from "../core"
import { ControllerInvocation } from "./controller-invocation"
import "reflect-metadata"
import * as Kecubung from "kecubung"
import { InterceptorInvocation } from "./interceptor-invocation"

const InterceptorMetadataKey = "kamboja:interceptor"
export function interceptor(interceptor: Core.Interceptor | string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let interceptors: (Core.Interceptor | string)[] = Reflect.getMetadata(InterceptorMetadataKey, target, propertyKey) || []
        interceptors.push(interceptor);
        Reflect.defineMetadata(InterceptorMetadataKey, interceptors, target, propertyKey)
    }
}

function getInterceptors(target, methodName: string) {
    let interceptors: (Core.Interceptor | string)[] = Reflect.getMetadata(InterceptorMetadataKey, target, propertyKey) || []
    return interceptors
}

export class ControllerExecutor {

    constructor(private facade: Core.Facade,
        private routeInfo: Core.RouteInfo,
        private request: Core.HttpRequest,
        private response: Core.HttpResponse) { }

    async execute() {
        let controller: Core.Controller;
        try {
            controller = this.facade.dependencyResolver.resolve(this.routeInfo.classId)
        }
        catch (e) {
            throw new Error(`Can not instantiate [${this.routeInfo.classId}] as Controller`)
        }
        let invocation:Core.Invocation = new ControllerInvocation(controller, this.facade, this.routeInfo, this.request);
        let interceptors = this.getAllInterceptors(controller)
        invocation.interceptors = interceptors;
        for (let interceptor of interceptors) {
            invocation = new InterceptorInvocation(invocation, interceptor)
        }
        await invocation.execute()
    }

    getAllInterceptors(controller: Core.Controller) {
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
                    throw new Error(`Unable to instantiate interceptor [${intercept}] on [${this.routeInfo.qualifiedClassName}] on method [${Core.getMethodName(this.routeInfo)}]`)
                }
            }
            else {
                result.push(intercept)
            }
        }
        return result;
    }
}