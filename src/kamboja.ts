import * as Core from "./core"
import * as Lodash from "lodash"
import { DefaultDependencyResolver } from "./resolver/dependency-resolver"
import { DefaultIdentifierResolver } from "./resolver/identifier-resolver"
import { RouteGenerator } from "./route-generator"
import * as Fs from "fs"

export class Kamboja {
    private option: Core.KambojaOption;
    private analysis: Core.RouteAnalysis[]

    constructor(private engine:Core.Engine, option?: Core.KambojaOption) {
        this.option = Lodash.assign(<Core.KambojaOption>{
            skipAnalysis: false,
            showConsoleLog: true,
            controllerPaths: ["controller"],
            viewPath: "view",
            staticFilePath: "public",
            viewEngine: "pug",
            dependencyResolver: new DefaultDependencyResolver(),
            identifierResolver: new DefaultIdentifierResolver(),
        }, option)
    }

    getAnalysis() {
        return this.analysis
    }

    async setup() {
        let router = new RouteGenerator(this.option.controllerPaths,
            this.option.identifierResolver, Fs.readFile);
        let routes = await router.getRoutes()
        this.analysis = routes.analysis;
        if (!this.option.skipAnalysis && routes.analysis.length > 0) {
            this.printRoute(routes.result)
            this.printAnalysis(routes.analysis);
            if (routes.analysis.some(x => x.type == "Error")) {
                console.log("[Kamboja] Critical error, can't continue")
                process.exit();
            }
        }
        return this.engine.init(routes.result, this.option)
    }

    private printRoute(routes:Core.RouteInfo[]){
        console.log()
        console.log("Route List")
        for(let route of routes){
            if(route.analysis && route.analysis.length > 0) continue
            console.log(`${route.httpMethod} ${route.route}`)
        }
        console.log()
    }

    private printAnalysis(analysis: Core.RouteAnalysis[]) {
        for (let item of analysis) {
            console.log()
            if (item.type == "Warning" && this.option.showConsoleLog) {
                console.log("[Kamboja] Warning: " + item.message);
            }
            else if (item.type == "Error" && this.option.showConsoleLog) {
                console.log("[Kamboja] Error: " + item.message);
            }
        }
    }
}
