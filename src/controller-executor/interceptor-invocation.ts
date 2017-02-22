import * as Core from "../core"
import { ControllerInvocation } from "./controller-invocation"
import "reflect-metadata"
import * as Kecubung from "kecubung"


export class InterceptorInvocation implements Core.Invocation {
    methodName: string
    classMetaData: Kecubung.ClassMetaData
    returnValue: Core.ActionResult;
    parameters: any[]
    interceptors: Core.Interceptor[]

    constructor(private invocation:Core.Invocation, private interceptor:Core.Interceptor) {}

    async execute(): Promise<void> {
       await this.interceptor.intercept(this.invocation)
       this.classMetaData = this.invocation.classMetaData
       this.methodName = this.invocation.methodName
       this.returnValue = this.invocation.returnValue
       this.parameters = this.invocation.parameters
       this.interceptors = this.invocation.interceptors;
    }
}