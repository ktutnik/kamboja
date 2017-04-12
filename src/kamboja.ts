import * as Core from "./core"
import * as Lodash from "lodash"
import { MetaDataLoader } from "./metadata-loader/metadata-loader"
import { DefaultDependencyResolver, DefaultIdentifierResolver, DefaultPathResolver } from "./resolver"
import { RouteGenerator, RouteAnalyzer } from "./route-generator"
import * as Fs from "fs"
import * as Path from "path"
import * as Chalk from "chalk"
import { Logger } from "./logger"
import * as Babylon from "babylon"
import * as Kecubung from "kecubung"

export class Kamboja {
    private static defaultModelPath: string = "model"
    private static facade: Core.Facade;
    private options: Core.KambojaOption
    private log: Logger;
    private storage: MetaDataLoader;
    private interceptorFactories: Core.InterceptorFactory[] = []

    static getFacade() {
        return Kamboja.facade;
    }

    constructor(private engine: Core.Engine, opt: Core.KambojaOption | string) {
        let override: Core.KambojaOption;
        if (typeof opt === "string") override = { rootPath: opt }
        else override = opt
        let options = Lodash.assign({
            skipAnalysis: false,
            showConsoleLog: true,
            controllerPaths: ["controller"],
            modelPath: Kamboja.defaultModelPath,
            viewPath: "view",
            staticFilePath: "../www",
            viewEngine: "hbs",
            defaultPage: "/home/index",
            autoValidation: true,
            rootPath: undefined
        }, override)
        let idResolver = new DefaultIdentifierResolver()
        let pathResolver = new DefaultPathResolver(options.rootPath)
        let resolver = new DefaultDependencyResolver(idResolver, pathResolver)
        let storage = new MetaDataLoader(options.identifierResolver, pathResolver)
        options.identifierResolver = idResolver
        options.pathResolver = pathResolver
        options.dependencyResolver = resolver
        options.metaDataStorage = storage

        this.options = options
        Kamboja.facade = options;
        this.log = new Logger(this.options.showConsoleLog ? "Info" : "Error")
        this.storage = <MetaDataLoader>this.options.metaDataStorage
    }

    intercept(factory: Core.InterceptorFactory) {
        this.interceptorFactories.push(factory)
        return this
    }

    private registerInterceptors() {
        this.interceptorFactories.forEach(x => {
            let result = x(this.options)
            if (!this.options.interceptors) this.options.interceptors = []
            if (Array.isArray(result)) this.options.interceptors.push(...result)
            else this.options.interceptors.push(result)
        })
    }

    private isFolderProvided() {
        let result = true;

        //controller
        this.options.controllerPaths.forEach(x => {
            let path = this.options.pathResolver.resolve(x);
            if (!Fs.existsSync(path)) {
                result = false;
                this.log.error(`Controller path [${x}] provided in configuration is not exist`)
            }
        })
        //model
        let modelPath = this.options.pathResolver.resolve(this.options.modelPath)
        if (!Fs.existsSync(modelPath) && this.options.modelPath != Kamboja.defaultModelPath) {
            this.log.error(`Model path [${this.options.modelPath}] provided in configuration is not exist`)
            result = false;
        }
        return result;
    }

    private generateRoutes(controllerMeta: Kecubung.ParentMetaData[]) {
        let route = new RouteGenerator(this.options.identifierResolver, controllerMeta)
        let infos = route.getRoutes()
        if (infos.length == 0) {
            let paths = this.options.controllerPaths.join(",")
            this.log.error(`No controller found in [${paths}]`)
        }
        return infos;
    }

    private analyzeRoutes(infos: Core.RouteInfo[]) {
        let routeAnalyzer = new RouteAnalyzer(infos)
        let analysis = routeAnalyzer.analyse();
        for (let item of analysis) {
            if (item.type == "Warning")
                this.log.warning(item.message)
            else
                this.log.error(item.message)
        }
        if (analysis.some(x => x.type == "Error")) {
            return false;
        }
        let validRoutes = infos.filter(x => !x.analysis || x.analysis.length == 0)
        if (validRoutes.length == 0) {
            let path = this.options.controllerPaths.join(", ")
            this.log.newLine().error(`No valid controller found in [${path}]`)
            return false;
        }
        this.log.newLine().info("Routes generated successfully")
        this.log.info("--------------------------------------")
        validRoutes.forEach(x => {
            this.log.info(`${x.httpMethod}\t${x.route}`)
        })
        this.log.info("--------------------------------------")
        return true;
    }

    init() {
        if (!this.isFolderProvided()) throw new Error("Fatal error")
        this.storage.load(this.options.controllerPaths, "Controller")
        this.storage.load(this.options.modelPath, "Model")
        let routeInfos = this.generateRoutes(this.storage.getFiles("Controller"))
        if (routeInfos.length == 0) throw new Error("Fatal error")
        if (!this.analyzeRoutes(routeInfos)) throw new Error("Fatal Error")
        let app = this.engine.init(routeInfos, this.options)
        this.registerInterceptors()
        return app;
    }
}