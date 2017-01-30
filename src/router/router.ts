import * as Core from "../core"
import * as Path from "path"
import * as Fs from "fs"
import * as Kenanga from "kecubung"
import * as Babylon from "babylon"
import * as Transformer from "../transformers"
import {PathResolver} from "../resolver/path-resolver"

export class Router {
    private pathResolver:PathResolver;
    constructor(private path: string, private identifier: Core.IdentifierResolver) {
        this.pathResolver = new PathResolver()
     }

    private getFiles() {
        let fileDirectory = this.pathResolver.resolve(this.path)
        if (!Fs.existsSync(fileDirectory)) throw new Error(`Directory ${fileDirectory} not found`)
        return Fs.readdirSync(fileDirectory)
            .filter(x => Path.extname(x) == ".js")
            .map(x => Path.join(fileDirectory, x));
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

    private async createInfo(filePath: string) {
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

    getRoutes() {
        let files = this.getFiles();
        let promises:Promise<Core.RouteInfo>[] = []
        for (let file of files) {
            promises.push(this.createInfo(file))
        }
        return Promise.all(promises);
    }
}