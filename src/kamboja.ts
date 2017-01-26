import * as Core from "./core"
import * as Utils from "./utils"
import { DefaultResolver } from "./resolver"
import { ExpressEngine } from "./engine-express"
import { Router } from "./router"


export class Kamboja {
    engine: Core.Engine;
    option: Core.KambojaOption;

    private static resolver: Core.DependencyResolver = new DefaultResolver();

    static registerResolver(resolver: Core.DependencyResolver) {
        Kamboja.resolver = resolver;
    }

    constructor(option?: Core.KambojaOption) {
        this.option = Utils.override(option, <Core.KambojaOption>{
            controllerPath: "./controller",
            onAppSetup: (app): void => { }
        })
        if (!this.option.engine) {
            this.engine = new ExpressEngine(Kamboja.resolver, {
                onAppSetup: this.option.onAppSetup
            })
        }
        let router = new Router(this.option.controllerPath, Kamboja.resolver);
        this.engine.setRoutes(router.getRoutes())
    }

    getApp() {
        return this.engine.getApp();
    }
}
