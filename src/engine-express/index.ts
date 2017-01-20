import * as Core from "../core"
import * as Express from "express"
import { RequestAdapter } from "./request-adapter"
import { ResponseAdapter } from "./response-adapter"

export class ExpressEngine implements Core.Engine {
    app: Express.Application;
    constructor(app?: Express.Application) {
        if (!app) {
            this.app = Express();
            //setup body parser etc
        }
        else {
            this.app = app
        }
    }

    register(handler: Core.RequestHandler) {
        switch (handler.routeInfo.httpMethod) {
            case "GET":
                this.app.get(handler.routeInfo.route, this.createMiddleware(handler))
                break;
            case "POST":
                this.app.post(handler.routeInfo.route, this.createMiddleware(handler))
                break;
            case "PUT":
                this.app.put(handler.routeInfo.route, this.createMiddleware(handler))
                break;
            case "DELETE":
                this.app.delete(handler.routeInfo.route, this.createMiddleware(handler))
                break;
        }
        return this;
    }

    listen(port?: number) {
        this.app.listen(port);
    }

    createMiddleware(handler: Core.RequestHandler): Express.RequestHandler {
        return (req, resp, next) => {
            handler.onRequest(new RequestAdapter(req), new ResponseAdapter(resp))
        };
    }
}



