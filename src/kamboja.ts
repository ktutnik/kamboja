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
    private static options: Core.KambojaOption;
    private options: Core.KambojaOption
    private log: Logger;
    private storage: MetaDataLoader;

    constructor(private engine: Core.Engine, override?: Core.KambojaOption) {
        let options = Lodash.assign({
            skipAnalysis: false,
            showConsoleLog: true,
            controllerPaths: ["controller"],
            modelPath: Kamboja.defaultModelPath,
            viewPath: "view",
            staticFilePath: "public",
            viewEngine: "hbs",
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
        this.log = new Logger(this.options.showConsoleLog ? "Info" : "Error")
        this.storage = <MetaDataLoader>this.options.metaDataStorage
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
        this.log.newLine().info("Route generated successfully")
        console.log("--------------------------------------")
        validRoutes.forEach(x => {
            console.log(`${x.httpMethod}\t${x.route}`)
        })
        console.log("--------------------------------------")
        return true;
    }

    init() {
        if (!this.isFolderProvided()) throw new Error("Fatal error")
        this.storage.load(this.options.controllerPaths, "Controller")
        this.storage.load(this.options.modelPath, "Model")
        let routeInfos = this.generateRoutes(this.storage.getFiles("Controller"))
        if (routeInfos.length == 0) throw new Error("Fatal error")
        if (!this.analyzeRoutes(routeInfos)) throw new Error("Fatal Error")
        return this.engine.init(routeInfos, this.options)
    }
}