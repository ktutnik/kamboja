import * as Core from "../core"
import { ControllerInvocation } from "./controller-invocation"
import "reflect-metadata"
import * as Kecubung from "kecubung"
import { InterceptorInvocation } from "./interceptor-invocation"
import { getInterceptors } from "./interceptor-decorator"
import { ValidatorImpl } from "../validator/validator"
import { ParameterBinder } from "../parameter-binder"

export class RequestHandler {
    constructor(private facade: Core.Facade,
        private routeInfo: Core.RouteInfo,
        private request: Core.HttpRequest,
        private response: Core.HttpResponse) { }

    async execute() {
        let parameterBinder = new ParameterBinder(this.routeInfo, this.request)
        let parameters = parameterBinder.getParameters()
        let controller = this.getController(parameters)
        let invocation: Core.Invocation = new ControllerInvocation(controller, this.routeInfo, this.request);
        let interceptors = this.getAllInterceptors(controller)
        invocation.interceptors = interceptors;
        invocation.parameters = parameters
        for (let interceptor of interceptors) {
            invocation = new InterceptorInvocation(invocation, interceptor)
        }
        await invocation.execute()
        invocation.returnValue.execute(this.response, this.routeInfo)
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
                        throw new Error(`Can not instantiate custom validator ${x}`)
                    }
                }
                else commands.push(x)
            })
        }
        return new ValidatorImpl(this.facade.metaDataStorage, commands)
    }

    private getController(parameters: any[]) {
        let controller: Core.Controller;
        try {
            let validator = this.getValidator();
            controller = this.facade.dependencyResolver.resolve(this.routeInfo.classId)
            validator.setValue(parameters, this.routeInfo.classMetaData, this.routeInfo.methodMetaData.name)
            controller.validator = validator;
            return controller
        }
        catch (e) {
            throw new Error(`Can not instantiate [${this.routeInfo.classId}] as Controller`)
        }
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