import { internal, http, Controller, Core } from "kamboja"
import * as Model from "../model/user-model"
import { Request, Response, NextFunction } from "express"
import { MiddlewareActionResult, middleware } from "../../../src"
import { Return400Middleware } from "../interceptor/400-middleware"
import { response } from "../../../src"
import { authenticate } from "passport"

let Middleware = (req: Request, res: Response, next: NextFunction) => {
    res.status(401)
    res.end()
}

export class UserController extends Controller {
    index() {
        return response.view()
    }

    hasError() {
        throw new Error("This user error")
    }

    executeMiddleware() {
        return new MiddlewareActionResult((req: Request, res: Response, next: NextFunction) => {
            res.status(401)
            next()
        })
    }


    @http.get("with/:id")
    withParam(id: string, iAge: number, bGraduated: boolean) {
        return { id: id, age: iAge, graduated: bGraduated }
    }

    @middleware.use(new Return400Middleware())
    withMiddleware() {
        return response.view()
    }

    setHeader() {
        let result = new Core.ActionResult({})
        result.header = { Accept: "text/xml" }
        return result;
    }

    @middleware.use((req, res, next) => {
        res.setHeader("custom-header", "hello")
        next()
    })
    expressMiddlewareChain() {
        return "Hello"
    }

    @middleware.use((req, res, next) => {
        next(new Error("USER ERROR"))
    })
    expressMiddlewareSendError() {
        return "Hello"
    }

    @middleware.use((req, res, next) => {
        setTimeout(function () {
            res.setHeader("custom-header", "hello")
            next()
        }, 100);
    })
    expressMiddlewareAsync() {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve("Hello")
            }, 500);
        })
    }

    @middleware.use((req, res, next) => {
        setTimeout(function () {
            res.setHeader("custom-header", "hello")
            res.send("Not Hello")
        }, 100);
    })
    expressMiddlewareAsyncBypassAction() {
        return "Hello"
    }
}