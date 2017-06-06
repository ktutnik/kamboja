import * as Core from "../core"
import * as Path from "path"
import * as Fs from "fs"
import * as Kecubung from "kecubung"
import * as Babylon from "babylon"
import * as Transformer from "./transformers"
import * as Analyzer from "./analyzer"
import { DefaultPathResolver } from "../resolver/path-resolver"

export class RouteGenerator {

    constructor(private idResolver: Core.IdentifierResolver,
        private metaData: Kecubung.ParentMetaData[]) { }

    getRoutes() {
        let routes: Core.RouteInfo[] = []
        for (let file of this.metaData) {
            let route = Transformer.transform(file)
            route.forEach(x => {
                x.classId = this.idResolver.getClassId(x.qualifiedClassName)
                routes.push(x)
            })
        }
        return routes
    }
}