import * as Core from "kamboja-core"
import { ValidatorImpl } from "../validator"
import { Kamboja } from "../kamboja"
import { Middleware } from "../index"


export class ControllerFactory {
    constructor(public facade: Core.Facade, public routeInfo: Core.RouteInfo) {
    }

    createController(): Core.BaseController {
        try {
            return this.facade.dependencyResolver.resolve(this.routeInfo.classId)
        }
        catch (e) {
            throw new Error(`Can not instantiate [${this.routeInfo.classId}] as Controller.\n\t Inner message: ${e.message}`)
        }
    }

    createValidatorForParameters(values: any[]) {
        let validator = new ValidatorImpl(this.facade.metaDataStorage, this.getValidatorCommands())
        validator.setValue(values, this.routeInfo.classMetaData, this.routeInfo.methodMetaData.name)
        return validator
    }

    getValidatorCommands() {
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
        return commands
    }
}