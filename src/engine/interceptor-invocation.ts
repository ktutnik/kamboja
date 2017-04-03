import * as Core from "../core"
import { ControllerExecutor } from "../engine/controller-executor"
import "reflect-metadata"
import * as Kecubung from "kecubung"
import { ParameterBinder } from "../parameter-binder"

export class InterceptorInvocation extends Core.Invocation {
    constructor(private invocation: Core.Invocation, 
        private interceptor: Core.RequestInterceptor,
        public option:Core.KambojaOption) { super() }

    async execute(): Promise<Core.ActionResult> {
        this.classMetaData = this.invocation.classMetaData
        this.methodName = this.invocation.methodName
        this.parameters = this.invocation.parameters
        this.interceptors = this.invocation.interceptors;
        this.request = this.invocation.request
        this.url = this.invocation.url
        return await this.interceptor.intercept(this.invocation)
    }
}
