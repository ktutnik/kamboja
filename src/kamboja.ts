import * as Core from "./core"
import * as Lodash from "lodash"
import { InMemoryMetaDataStorage } from "./metadata-storage"
import { DefaultDependencyResolver, DefaultIdentifierResolver, PathResolver } from "./resolver"
import { RangeValidator, RequiredValidator, EmailValidator } from "./validator"
import { RouteGenerator, RouteAnalyzer } from "./route-generator"
import * as Fs from "fs"
import * as Path from "path"
import * as Chalk from "chalk"
import { Logger } from "./logger"
import * as Babylon from "babylon"
import * as Kecubung from "kecubung"

export class Kamboja {
    private options: Core.KambojaOption
    private log: Logger;
    private storage:Core.MetaDataStorage;

    constructor(private engine: Core.Engine, options?: Core.KambojaOption) {
        this.options = Lodash.assign(<Core.KambojaOption>{
            skipAnalysis: false,
            showConsoleLog: true,
            controllerPaths: ["controller"],
            modelPath: "model",
            viewPath: "view",
            staticFilePath: "public",
            viewEngine: "hbs",
            dependencyResolver: new DefaultDependencyResolver(new DefaultIdentifierResolver()),
            identifierResolver: new DefaultIdentifierResolver(),
        }, options)
        this.storage = new InMemoryMetaDataStorage(this.options.identifierResolver);
        this.options.getStorage = () => {
            return this.storage;
        }
        this.log = new Logger(this.options.showConsoleLog ? "Info" : "Error")
    }

    private loadModels() {
        let pathResolver = new PathResolver();
        let path = pathResolver.resolve(this.options.modelPath)
        if (!Fs.existsSync(path)) return true;
        let modelPaths = Fs.readdirSync(path)
            .filter(x => Path.extname(x) == ".js")
            .map(x => Path.join(path, x));
        modelPaths.forEach(x => {
            let code = Fs.readFileSync(x).toString()
            let ast = Babylon.parse(code)
            let meta = Kecubung.transform("ASTree", ast, pathResolver.relative(x))
            this.options.getStorage().save(meta)
        })
        return true
    }

    private isFolderProvided() {
        let result = true;
        let pathResolver = new PathResolver();
        //controller
        this.options.controllerPaths.forEach(x => {
            let path = pathResolver.resolve(x);
            if (!Fs.existsSync(path)) {
                result = false;
                this.log.error(`Controller path [${x}] provided in configuration is not exist`)
            }
        })
        //model
        let modelPath = pathResolver.resolve(this.options.modelPath)
        if (!Fs.existsSync(modelPath)) {
            this.log.warning(`Model path [${this.options.modelPath}] provided in configuration is not exist`)
        }
        return result;
    }

    private generateRoutes() {
        let route = new RouteGenerator(this.options.controllerPaths, this.options.identifierResolver, this.options.getStorage(), Fs.readFileSync)
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
        this.loadModels()
        let routeInfos = this.generateRoutes()
        if (routeInfos.length == 0) throw new Error("Fatal error")
        if (!this.analyzeRoutes(routeInfos)) throw new Error("Fatal Error")
        return this.engine.init(routeInfos, this.options)
    }
}