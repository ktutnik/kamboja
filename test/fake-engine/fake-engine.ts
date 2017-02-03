import * as Core from "../../src/core"
import * as Express from "express"
import * as Logger from "morgan"
import * as CookieParser from "cookie-parser"
import * as BodyParser from "body-parser"
import { RequestAdapter } from "./request-adapter"
import { ResponseAdapter } from "./response-adapter"
import { RequestHandler } from "../../src/request-handler"
import { PathResolver } from "../../src/resolver"
import * as Http from "http";

export class FakeEngine implements Core.Engine {
    app: Express.Application;
    constructor(private resolver: Core.DependencyResolver) {
    }

    private initExpress(options:Core.KambojaOption) {
        let pathResolver = new PathResolver();
        let app = Express();
        app.set("views", pathResolver.resolve(options.viewPath))
        app.set("view engine", options.viewEngine)
        if(options.showConsoleLog) app.use(Logger("dev"))
        app.use(BodyParser.json())
        app.use(BodyParser.urlencoded({ extended: false }));
        app.use(CookieParser());
        app.use(Express.static(pathResolver.resolve(options.staticFilePath)))
        if (options.overrideAppEngine)
            options.overrideAppEngine(app)
        this.app = app;
    }

    private initErrorHandler(options:Core.KambojaOption) {
        let env = this.app.get('env')
        this.app.use((err, req, res, next) => {
            let status = err.status || 500;
            if (options.errorHandler) {
                options.errorHandler(new Core.HttpError(status, err,
                    new RequestAdapter(req), new ResponseAdapter(res, next)))
            }
            else {
                res.status(status);
                res.render('error', {
                    message: err.message,
                    error: env == "development" ? err : {}
                });
            }
        })
    }

    private initController(routes: Core.RouteInfo[], options:Core.KambojaOption) {
        for (let route of routes) {
            if(route.analysis && route.analysis.length > 0) continue
            let method = route.httpMethod.toLowerCase();
            this.app[method](route.route, async (req, resp, next) => {
                let handler = new RequestHandler(route, this.resolver,
                    new RequestAdapter(req), new ResponseAdapter(resp, next))
                await handler.execute();
            })
        }
    }

    init(routes: Core.RouteInfo[], options:Core.KambojaOption) {
        this.initExpress(options)
        this.initController(routes, options)
        this.initErrorHandler(options)
        return this.app;
    }

}



