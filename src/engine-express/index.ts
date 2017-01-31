import * as Core from "../core"
import * as Express from "express"
import { RequestAdapter } from "./request-adapter"
import { ResponseAdapter } from "./response-adapter"
import { RequestHandler } from "../request-handler"
import * as Http from "http";
import * as Lodash from "lodash"

export interface ExpressEngineOptions {
    onAppSetup?: (app) => void
    app?: Express.Application
    viewPath?: string,
    staticFilePath?:string,
}

export class ExpressEngine implements Core.Engine {
    app: Express.Application;
    constructor(private resolver: Core.DependencyResolver, options?: ExpressEngineOptions) {
        let app = Express();
        
    }

    setRoutes(routes: Core.RouteInfo[]) {
        for (let route of routes) {
            let method = route.route.toLowerCase();
            this.app[method](route.route, (req, resp, next) => {
                let handler = new RequestHandler(route, this.resolver)
                handler.onRequest(new RequestAdapter(req), new ResponseAdapter(resp))
            })
        }
        return this;
    }

    getApp() {
        return this.app;
    }
}



