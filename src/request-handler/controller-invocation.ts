import * as Core from "../core"
import { ValidatorImpl } from "../validator"
import * as Kecubung from "kecubung"
import { Controller } from "../controller"
import { ParameterBinder } from "../parameter-binder"
import { JsonActionResult } from "../controller/json-action-result"

export class ControllerInvocation implements Core.Invocation {
    private validator:ValidatorImpl;
    methodName: string
    classMetaData: Kecubung.ClassMetaData
    returnValue: any;
    parameters: any[]
    interceptors: Core.Interceptor[]

    constructor(private controller:Controller,
        private routeInfo: Core.RouteInfo,
        private request: Core.HttpRequest) {
        this.methodName = routeInfo.methodMetaData.name;
        this.classMetaData = routeInfo.classMetaData
    }

    async execute(): Promise<void> {
        let method = <Function>this.controller[this.routeInfo.methodMetaData.name]
        let result = method.apply(this.controller, this.parameters);
        if (this.routeInfo.classMetaData.baseClass == "Controller") {
            this.returnValue = await <Promise<Core.ActionResult>>Promise.resolve(result);
        }
        else {
            let apiResult = await <Promise<any>>Promise.resolve(result);
            this.returnValue = new JsonActionResult(apiResult, undefined, undefined)
        }
    }
}
