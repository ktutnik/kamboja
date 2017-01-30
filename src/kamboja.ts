import * as Core from "./core"
import { DefaultDependencyResolver } from "./resolver/dependency-resolver"
import { DefaultIdentifierResolver } from "./resolver/identifier-resolver"
import * as Lodash from "lodash"
import { ExpressEngine } from "./engine-express"
import { Router } from "./router/router"


export class Kamboja {
    engine: Core.Engine;
    option: Core.KambojaOption;

    constructor(option?: Core.KambojaOption) {
        this.option = Lodash.assign(option, <Core.KambojaOption>{
            controllerPath: "./controller",
            dependencyResolver: new DefaultDependencyResolver(),
            identifierResolver: new DefaultIdentifierResolver(),
            onAppSetup: (app): void => { }
        })
        if (!this.option.engine) {
            this.engine = new ExpressEngine(this.option.dependencyResolver, {
                onAppSetup: this.option.onAppSetup
            })
        }
        let router = new Router(this.option.controllerPath, this.option.identifierResolver);
        router.getRoutes().then((routes) => {
            this.engine.setRoutes(routes)
        })
    }

    getApp() {
        return this.engine.getApp();
    }
}
