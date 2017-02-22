import * as Core from "../core"
import { ValidatorImpl } from "../validator/validator"
import {Executor} from "./executor"

export class RequestHandler {
    executor: Executor;
    constructor(metaDataStorage: Core.MetaDataStorage,
        resolver: Core.DependencyResolver,
        validators: Array<Core.ValidatorCommand | string>,
        routeInfo: Core.RouteInfo,
        request: Core.HttpRequest,
        response: Core.HttpResponse) {
        let commands: Core.ValidatorCommand[] = [];
        if (validators) {
            validators.forEach(x => {
                if (typeof x == "string") {
                    let validator = resolver.resolve(x)
                    commands.push(validator)
                }
                else commands.push(x)
            })
        }
        let validator = new ValidatorImpl(metaDataStorage, commands)
        this.executor = new Executor(validator, resolver, routeInfo, request, response)
    }

    async execute() {
        await this.executor.execute()
    }
}
