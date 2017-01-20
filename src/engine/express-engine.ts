import * as Core from "../core"
import * as Express from "express"

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

    listen(port?:number) {
        this.app.listen(port);
    }

    createMiddleware(handler: Core.RequestHandler): Express.RequestHandler {
        return (req, resp, next) => {
            handler.onRequest(new ExpressRequest(req), new ExpressResponse(resp))
        };
    }
}

export class ExpressRequest implements Core.HttpRequest {
    headers: { [key: string]: string }
    cookies: { [key: string]: string }
    params: { [key: string]: string }
    body: any
    referrer: string
    url: string

    constructor(request: Express.Request) { }

    getHeader(key: string): string { return null; }
    getCookie(key: string): string { return null }
    getParam(key: string): string { return null }
}

export class ExpressResponse implements Core.HttpResponse {
    status: string
    type: string

    constructor(response: Express.Response) {
    }

    write(obj) { }
}


