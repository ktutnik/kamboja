import * as Core from "../core"
import { ControllerExecutor } from "../engine/controller-executor"
import "reflect-metadata"
import * as Kecubung from "kecubung"
import { getInterceptors } from "./interceptor-decorator"
import { ParameterBinder } from "../parameter-binder"

export class InterceptorInvocation extends Core.Invocation {
    constructor(private invocation: Core.Invocation, private interceptor: Core.Interceptor) { super() }

    async execute(): Promise<void> {
        await this.interceptor.intercept(this.invocation)
        this.classMetaData = this.invocation.classMetaData
        this.methodName = this.invocation.methodName
        this.returnValue = this.invocation.returnValue
        this.parameters = this.invocation.parameters
        this.interceptors = this.invocation.interceptors;
    }
}
