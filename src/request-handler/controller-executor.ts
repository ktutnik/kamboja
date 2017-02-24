import * as Core from "../core"
import { ValidatorImpl } from "../validator"
import * as Kecubung from "kecubung"
import { Controller } from "../controller"
import { ParameterBinder } from "../parameter-binder"
import { JsonActionResult } from "../controller/json-action-result"

export class ControllerExecutor {
    controller:Core.Controller
    constructor(private facade: Core.Facade,
        private routeInfo: Core.RouteInfo,
        private request: Core.HttpRequest) {
    }

    async execute(parameters: any[]) {
        this.controller = this.getController()
        this.controller.validator = this.getValidator(parameters)
        let method = <Function>this.controller[this.routeInfo.methodMetaData.name]
        let result = method.apply(this.controller, parameters);
        if (this.routeInfo.classMetaData.baseClass == "Controller") {
            return <Promise<Core.ActionResult>>Promise.resolve(result);
        }
        else {
            let apiResult = await <Promise<any>>Promise.resolve(result);
            if(typeof apiResult == "undefined" || apiResult == null) return;
            let actionResult = new JsonActionResult(apiResult, undefined, undefined)
            return <Promise<Core.ActionResult>>Promise.resolve(actionResult);
        }
    }

    private getController() {
        let controller: Core.Controller;
        try {
            controller = this.facade.dependencyResolver.resolve(this.routeInfo.classId)
            return controller
        }
        catch (e) {
            throw new Error(`Can not instantiate [${this.routeInfo.classId}] as Controller`)
        }
    }

    private getValidator(parameters: any[]) {
        let commands: Core.ValidatorCommand[] = [];
        if (this.facade.validators) {
            this.facade.validators.forEach(x => {
                if (typeof x == "string") {
                    try {
                        let validator = this.facade.dependencyResolver.resolve(x)
                        commands.push(validator)
                    }
                    catch (e) {
                        throw new Error(`Can not instantiate custom validator [${x}]`)
                    }
                }
                else commands.push(x)
            })
        }
        let validator = new ValidatorImpl(this.facade.metaDataStorage, commands)
        validator.setValue(parameters, this.routeInfo.classMetaData, this.routeInfo.methodMetaData.name)
        return validator
    }
}
