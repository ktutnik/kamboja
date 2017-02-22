import * as Core from "../core"
import { ValidatorImpl } from "../validator"
import * as Kecubung from "kecubung"
import { Controller } from "../controller"
import { ParameterBinder } from "../parameter-binder"
import { JsonActionResult } from "../controller/json-action-result"

export class ControllerInvocation implements Core.Invocation {
    private binder: ParameterBinder;
    private validator:ValidatorImpl;
    methodName: string
    classMetaData: Kecubung.ClassMetaData
    returnValue: any;
    parameters: any[]
    interceptors: Core.Interceptor[]

    constructor(private controller:Controller,
        private facade:Core.Facade,
        private routeInfo: Core.RouteInfo,
        private request: Core.HttpRequest) {
        this.binder = new ParameterBinder(routeInfo, request)
        this.methodName = routeInfo.methodMetaData.name;
        this.classMetaData = routeInfo.classMetaData
        let commands: Core.ValidatorCommand[] = [];
        if (facade.validators) {
            facade.validators.forEach(x => {
                if (typeof x == "string") {
                    //todo: possibly throw error
                    let validator = facade.dependencyResolver.resolve(x)
                    commands.push(validator)
                }
                else commands.push(x)
            })
        }
        this.validator = new ValidatorImpl(facade.metaDataStorage, commands)
    }

    async execute(): Promise<void> {
        this.parameters = this.binder.getParameters();
        this.validator.setValue(this.parameters, this.routeInfo.classMetaData, this.routeInfo.methodMetaData.name)
        this.controller.validator = this.validator;
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
