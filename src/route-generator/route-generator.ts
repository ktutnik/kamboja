import * as Core from "../core"
import * as Path from "path"
import * as Fs from "fs"
import * as Kenanga from "kecubung"
import * as Babylon from "babylon"
import * as Transformer from "./transformers"
import * as Analyzer from "./analyzer"
import { PathResolver } from "../resolver/path-resolver"
import { MetaDataStorage } from "../metadata-storage"

export class RouteGenerator {
    private pathResolver: PathResolver;
    private routes: Core.RouteInfo[];

    constructor(private paths: string[], private facade:Core.Facade,
        private fileReader: (path: string) => Buffer) {
        this.pathResolver = new PathResolver()
    }

    private getFiles() {
        let result: string[] = []
        for (const path of this.paths) {
            const fileDirectory = this.pathResolver.resolve(path)
            if (!Fs.existsSync(fileDirectory)) continue;
            const resultPaths = Fs.readdirSync(fileDirectory)
                .filter(x => Path.extname(x) == ".js")
                .map(x => Path.join(fileDirectory, x));
            result.push(...resultPaths)
        }
        return result;
    }

    getRoutes() {
        let files = this.getFiles();
        let routeInfos: Core.RouteInfo[] = [];
        for (let file of files) {
            let code = this.fileReader(file).toString();
            let ast = Babylon.parse(code)
            let filename = this.pathResolver.relative(file)
            let meta = Kenanga.transform("ASTree", ast, filename)
            let infos = Transformer.transform(meta);
            for (let route of infos) {
                route.classId = this.facade.idResolver.getClassId(route.qualifiedClassName)
            }
            this.facade.metadataStorage.save(meta)
            routeInfos.push(...infos)
        }
        return routeInfos;
    }

}