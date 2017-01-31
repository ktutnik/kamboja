import * as Core from "../core"
import * as Path from "path"
import * as Fs from "fs"
import * as Kenanga from "kecubung"
import * as Babylon from "babylon"
import * as Transformer from "../transformers"
import * as Analyzer from "../analyzer"
import { PathResolver } from "../resolver/path-resolver"

export class Router {
    private pathResolver: PathResolver;
    private routes: Core.RouteInfo[];

    constructor(private paths: string[], private identifier: Core.IdentifierResolver) {
        this.pathResolver = new PathResolver()
    }

    private getFiles() {
        let result: string[] = []
        for (let path of this.paths) {
            let fileDirectory = this.pathResolver.resolve(path)
            if (!Fs.existsSync(fileDirectory)) throw new Error(`Directory ${fileDirectory} not found`)
            let resultPaths = Fs.readdirSync(fileDirectory)
                .filter(x => Path.extname(x) == ".js")
                .map(x => Path.join(fileDirectory, x));
            result = result.concat(resultPaths)
        }
        return result;
    }

    private readFile(path: string): Promise<string> {
        return new Promise(function (resolve, reject) {
            Fs.readFile(path, function (err, data) {
                if (err)
                    reject(err);
                else
                    resolve(data.toString());
            });
        });
    }

    private async createInfo(filePath: string):Promise<Core.RouteInfo[]> {
        let code = await this.readFile(filePath)
        let ast = Babylon.parse(code)
        let fileName = this.pathResolver.relative(filePath);
        let meta = Kenanga.transform("ASTree", ast, fileName)
        let routeInfos = Transformer.transform(meta);
        routeInfos.forEach(x => {
            x.classId = this.identifier.getClassId(x.className)
        })
        return routeInfos;
    }

    async getRoutes() {
        let files = this.getFiles();
        let promises: Promise<Core.RouteInfo>[] = []
        for (let file of files) {
            promises.push(this.createInfo(file))
        }
        this.routes = await Promise.all(promises);
        let result:Core.RouteInfo[] = []
        for(let route of this.routes){
            result = result.concat(route)
        }
        return result;
    }
}