import * as Core from "./core"
import * as Lodash from "lodash"
import { DefaultDependencyResolver } from "./resolver/dependency-resolver"
import { DefaultIdentifierResolver } from "./resolver/identifier-resolver"
import { ExpressEngine } from "./engine-express"
import { Router } from "./router"

export class Kamboja {
    engine: Core.Engine;
    option: Core.KambojaOption;

    constructor(option?: Core.KambojaOption) {
        this.option = Lodash.assign(option, <Core.KambojaOption>{
            controllerPaths: ["controller"],
            viewPath: "view",
            staticFilePath: "public",
            dependencyResolver: new DefaultDependencyResolver(),
            identifierResolver: new DefaultIdentifierResolver(),
            onAppSetup: (app): void => { }
        })
        if (!this.option.engine) {
            this.engine = new ExpressEngine(this.option.dependencyResolver, {
                onAppSetup: this.option.onAppSetup
            })
        }
    }

    async setup() {
        let router = new Router(this.option.controllerPaths, this.option.identifierResolver);
        let routes = await router.getRoutes()
        this.engine.setRoutes(routes)
        return this.engine.getApp();
    }
}
