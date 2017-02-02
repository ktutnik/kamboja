import * as Core from "./core"
import * as Lodash from "lodash"
import { DefaultDependencyResolver } from "./resolver/dependency-resolver"
import { DefaultIdentifierResolver } from "./resolver/identifier-resolver"
import { ExpressEngine } from "./engine-express"
import { RouteGenerator } from "./route-generator"
import * as Fs from "fs"

export class Kamboja {
    private engine: Core.Engine;
    private option: Core.KambojaOption;
    private routes: Core.RouteInfo[]

    constructor(option?: Core.KambojaOption) {
        this.option = Lodash.assign(<Core.KambojaOption>{
            verbose:true,
            exitOnError: true,
            controllerPaths: ["controller"],
            viewPath: "view",
            staticFilePath: "public",
            viewEngine: "pug",
            dependencyResolver: new DefaultDependencyResolver(),
            identifierResolver: new DefaultIdentifierResolver(),
        }, option)
        if (!this.option.engine) {
            this.engine = new ExpressEngine(this.option.dependencyResolver, this.option)
        }
    }

    getRoutes(){
        return this.routes;
    }

    async setup() {
        let router = new RouteGenerator(this.option.controllerPaths, 
            this.option.identifierResolver, Fs.readFile);
        let routes = await router.getRoutes()
        this.routes = routes.result;
        if(routes.analysis.length > 0){
            this.printAnalysis(routes.analysis);
        }
        if(this.option.exitOnError && routes.analysis.some(x => x.type == "Error")){
            console.log("[Kamboja] Process exited")
            process.exit(1)
        }
        
        return this.engine.init(routes.result)
    }

    private printAnalysis(analysis:Core.RouteAnalysis[]){
        for(let item of analysis){
            console.log()
            if(item.type == "Warning" && this.option.verbose){
                console.log("[Kamboja] Warning: " + item.message);
            }
            else if(item.type == "Error"){
                console.log("[Kamboja] Error: " + item.message);
            }
        }
    }
}
