import { Kamboja, Core } from "kamboja"
import { ExpressEngine } from "./express-engine"
import { ExpressMiddlewareAdapter } from "./express-middleware-adapter"
import { RequestHandler, Application } from "express"

type KambojaOptionKeys = keyof Core.KambojaOption
type ExpressOptionKeys = "case sensitive routing" | "env" | "etag"
    | "json replacer" | "json spaces" | "query parser" | "trust proxy"
    | "views" | "view cache" | "view engine" | "x-powered-by"
type OptionKeys = KambojaOptionKeys | ExpressOptionKeys

export class KambojaApplication {
    private expressEngine: ExpressEngine;
    private kamboja: Kamboja;

    constructor(opt: string | Core.KambojaOption) {
        this.expressEngine = new ExpressEngine();
        this.kamboja = new Kamboja(this.expressEngine, opt)
    }

    set(setting: OptionKeys, value: any) {
        switch (setting) {
            case "case sensitive routing":
            case "env":
            case "etag":
            case "json replacer":
            case "json spaces":
            case "query parser":
            case "trust proxy":
            case "views":
            case "view cache":
            case "view engine":
            case "x-powered-by":
                this.expressEngine.application.set(setting, value)
                break;
            default:
                this.kamboja.set(setting, value)
        }
        return this;
    }

    get(setting: keyof Core.KambojaOption) {
        return this.kamboja.get(setting)
    }

    apply(facility: Core.Facility | string) {
        this.kamboja.apply(facility)
        return this;
    }

    use(middleware: RequestHandler | Core.Middleware | string) {
        if (typeof middleware == "function") {
            this.expressEngine.application.use(middleware)
        }
        else {
            this.kamboja.use(middleware)
        }
        return this;
    }

    init(): Application {
        return this.kamboja.init();
    }
}