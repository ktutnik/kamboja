import * as Core from "../core"
import * as Path from "path"
import * as Fs from "fs"
import * as Kenanga from "kecubung"
import * as Babylon from "babylon"
import * as Utils from "../utils"
import { FileTransformer } from "../transformers/file"

export class Router {
    constructor(private path: string, private resolver: Core.DependencyResolver) { }

    private getFiles() {
        let fileDirectory = Path.join(process.cwd(), this.path)
        if (!Fs.existsSync(fileDirectory)) throw new Error(`Directory ${fileDirectory} not found`)
        return Fs.readdirSync(fileDirectory)
            .filter(x => Path.extname(x) == ".js")
            .map(x => Path.join(fileDirectory, x));
    }

    getRoutes(): Core.RouteInfo[] {
        let files = this.getFiles();
        let routes: Core.RouteInfo[] = []
        for (let file of files) {
            let code = Fs.readFileSync(file).toString()
            let ast = Babylon.parse(code)
            let fileName = Path.relative(process.cwd(), file);
            let meta = Kenanga.transform(ast, fileName)
            let transformer = new FileTransformer();
            let routeInfos = transformer.transform(meta, "", undefined).info;
            routeInfos.forEach(x => {
                let instance = Utils.getInstance(x.className)
                x.classId = this.resolver.getClassId(x.className, instance)
            })
            routes = routes.concat(routeInfos)
        }
        return routes;
    }
}