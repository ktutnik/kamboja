import * as Core from "../core"
import * as Express from "express"
import * as Logger from "morgan"
import * as CookieParser from "cookie-parser"
import * as BodyParser from "body-parser"

import { RequestAdapter } from "./request-adapter"
import { ResponseAdapter } from "./response-adapter"
import { RequestHandler } from "../request-handler"
import { PathResolver } from "../resolver"
import * as Http from "http";
import * as Lodash from "lodash"

export interface ExpressEngineOptions {
    onAppSetup?: (app) => void
    app?: Express.Application
    viewPath?: string,
    viewEngine?: string,
    staticFilePath?: string,
}

export class ExpressEngine implements Core.Engine {
    app: Express.Application;
    constructor(private resolver: Core.DependencyResolver, options?: ExpressEngineOptions) {
        if(options && !options.app){
            this.app = this.initExpress(options)
        }
    }

    private initExpress(option: ExpressEngineOptions) {
        let pathResolver = new PathResolver();
        let app = Express();
        app.set("views", pathResolver.resolve(option.viewPath))
        app.set("view engine", option.viewEngine)
        app.use(Logger("dev"))
        app.use(BodyParser.json())
        app.use(BodyParser.urlencoded({ extended: false }));
        app.use(CookieParser());
        app.use(Express.static(pathResolver.resolve(option.staticFilePath)))
        return app;
    }

    init(routes: Core.RouteInfo[]) {
        for (let route of routes) {
            let method = route.httpMethod.toLowerCase();
            this.app[method](route.route, async (req, resp, next) => {
                let handler = new RequestHandler(route, this.resolver, new RequestAdapter(req), new ResponseAdapter(resp))
                await handler.execute();
            })
        }
        return this.app;
    }
}



