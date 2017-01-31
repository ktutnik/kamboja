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

export class ExpressEngine implements Core.Engine {
    app: Express.Application;
    constructor(private resolver: Core.DependencyResolver, private options?: Core.KambojaOption) {
    }

    private initExpress() {
        let pathResolver = new PathResolver();
        let app = Express();
        app.set("views", pathResolver.resolve(this.options.viewPath))
        app.set("view engine", this.options.viewEngine)
        app.use(Logger("dev"))
        app.use(BodyParser.json())
        app.use(BodyParser.urlencoded({ extended: false }));
        app.use(CookieParser());
        app.use(Express.static(pathResolver.resolve(this.options.staticFilePath)))
        if (this.options.overrideAppEngine)
            this.options.overrideAppEngine(app)
        this.app = app;
    }

    private initErrorHandler() {
        let env = this.app.get('env')
        this.app.use((err, req, res, next) => {
            let status = err.status || 500;
            if (this.options.errorHandler) {
                this.options.errorHandler(new Core.HttpError(status, err,
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

    private initController(routes: Core.RouteInfo[]) {
        for (let route of routes) {
            let method = route.httpMethod.toLowerCase();
            this.app[method](route.route, async (req, resp, next) => {
                let handler = new RequestHandler(route, this.resolver,
                    new RequestAdapter(req), new ResponseAdapter(resp, next))
                await handler.execute();
            })
        }
    }

    init(routes: Core.RouteInfo[]) {
        this.initExpress()
        this.initController(routes)
        this.initErrorHandler()
        return this.app;
    }

}



