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
            verbose:true,
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
        if(routes.analysis.length > 0){
            this.printAnalysis(routes.analysis);
        }
        if(routes.analysis.some(x => x.type == "Error")){
            console.log("[Kamboja] Info: Error found, quiting..")
            process.exit()
        }
        
        return this.engine.init(routes.result)
    }

    private printAnalysis(analysis:Core.RouteAnalysis[]){
        for(let item of analysis){
            if(item.type == "Warning" && this.option.verbose){
                console.log("[Kamboja] Warning: " + item.message);
            }
            else if(item.type == "Error"){
                console.log("[Kamboja] Error: " + item.message);
            }
        }
    }
}
