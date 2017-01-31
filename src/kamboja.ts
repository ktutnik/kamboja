import * as Core from "./core"
import * as Lodash from "lodash"
import { DefaultDependencyResolver } from "./resolver/dependency-resolver"
import { DefaultIdentifierResolver } from "./resolver/identifier-resolver"
import { ExpressEngine } from "./engine-express"
import { RouteGenerator } from "./route-generator"

export class Kamboja {
    engine: Core.Engine;
    option: Core.KambojaOption;

    constructor(option?: Core.KambojaOption) {
        this.option = Lodash.assign(option, <Core.KambojaOption>{
            verbose:true,
            controllerPaths: ["controller"],
            viewPath: "view",
            staticFilePath: "public",
            viewEngine: "pug",
            dependencyResolver: new DefaultDependencyResolver(),
            identifierResolver: new DefaultIdentifierResolver(),
        })
        if (!this.option.engine) {
            this.engine = new ExpressEngine(this.option.dependencyResolver, option)
        }
    }

    async setup() {
        let router = new RouteGenerator(this.option.controllerPaths, this.option.identifierResolver);
        let routes = await router.getRoutes()
        if(routes.analysis.length > 0){
            this.printAnalysis(routes.analysis);
        }
        if(routes.analysis.some(x => x.type == "Error")){
            console.log("[Kamboja] Info: Error found, quit.")
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
