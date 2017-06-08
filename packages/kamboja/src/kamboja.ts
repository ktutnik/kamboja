import * as Core from "kamboja-core"
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

/**
 * Create instance of KambojaJS application
 */
export class Kamboja {
    private static defaultModelPath: string = "model"
    private static facade: Core.Facade;
    private options: Core.KambojaOption
    private log: Logger;
    private storage: MetaDataLoader;

    static getFacade() {
        return Kamboja.facade;
    }

    /**
     * Create instance of KambojaJS application
     * @param engine KambojaJS engine implementation
     * @param opt KambojaJS option
     */
    constructor(private engine: Core.Engine, opt: Core.KambojaOption | string) {
        let override: Core.KambojaOption;
        if (typeof opt === "string") override = { rootPath: opt }
        else override = opt
        let idResolver = new DefaultIdentifierResolver()
        let pathResolver = new DefaultPathResolver(override.rootPath)
        let resolver = new DefaultDependencyResolver(idResolver, pathResolver)
        let storage = new MetaDataLoader(idResolver, pathResolver)
        let options = Lodash.assign(<Core.KambojaOption>{
            skipAnalysis: false,
            controllerPaths: ["controller"],
            modelPath: Kamboja.defaultModelPath,
            autoValidation: true,
            rootPath: undefined,
            showLog: "Info",
            identifierResolver:idResolver,
            pathResolver: pathResolver,
            dependencyResolver: resolver,
            metaDataStorage: storage
        }, override)
        this.options = options
        Kamboja.facade = options;
        this.log = new Logger(this.options.showLog)
        this.storage = <MetaDataLoader>this.options.metaDataStorage
    }

    /**
     * Add middleware
     * @param factory factory method that will be call after KambojaJS application initialized
     * @returns KambojaJS application
     */
    use(middleware: Core.MiddlewaresType) {
        if (!this.options.middlewares) this.options.middlewares = []
        if (Array.isArray(middleware)) 
            this.options.middlewares = this.options.middlewares.concat(middleware)
        else this.options.middlewares.push(middleware)
        return this
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
            let method = ""
            switch (x.httpMethod) {
                case "GET": method = "GET    "; break;
                case "PUT": method = "PUT    "; break;
                case "PATCH": method = "PATCH  "; break;
                case "POST": method = "POST   "; break;
                case "DELETE": method = "DELETE "; break;
            }
            this.log.info(`${method} ${x.route}`)
        })
        this.log.info("--------------------------------------")
        this.options.routeInfos = validRoutes;
        return true;
    }

    /**
     * Initialize KambojaJS application 
     * @returns Http Callback handler returned by KambojaJS Engine implementation
     */
    init() {
        if (!this.isFolderProvided()) throw new Error("Fatal error")
        this.storage.load(this.options.controllerPaths, "Controller")
        this.storage.load(this.options.modelPath, "Model")
        let routeInfos = this.generateRoutes(this.storage.getFiles("Controller"))
        if (routeInfos.length == 0) throw new Error("Fatal error")
        if (!this.analyzeRoutes(routeInfos)) throw new Error("Fatal Error")
        let app = this.engine.init(routeInfos, this.options)
        return app;
    }
}