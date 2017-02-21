import { MetaDataLoaderCategory, IdentifierResolver, MetaDataStorage } from "../core"
import { PathResolver } from "../resolver/path-resolver"
import { QualifiedName } from "../resolver/qualified-name"
import * as Fs from "fs"
import * as Path from "path"
import * as Kecubung from "kecubung"
import * as Babylon from "babylon"

export class MetaDataLoader implements MetaDataStorage {
    private pathResolver = new PathResolver()
    private storage: Array<{ meta: Kecubung.ParentMetaData, category: MetaDataLoaderCategory }> = []

    constructor(private idResolver: IdentifierResolver) { }

    load(path: string | string[], category: MetaDataLoaderCategory) {
        let files: string[]
        if (typeof path == "string") files = this.getFiles([path], category)
        else files = this.getFiles(path, category)
        for (let file of files) {
            let code = Fs.readFileSync(file).toString()
            let ast = Babylon.parse(code)
            let fileName = this.pathResolver.normalize(file)
            let meta = Kecubung.transform("ASTree", ast, fileName)
            this.storage.push({meta:meta, category: category})
        }
    }

    private getFiles(paths: string[], category:MetaDataLoaderCategory) {
        let result: string[] = []
        for (const path of paths) {
            const fileDirectory = this.pathResolver.resolve(path)
            if (!Fs.existsSync(fileDirectory) && category == "Controller") throw Error(`Directory not found [${path}]`);
            if (!Fs.existsSync(fileDirectory) && category == "Model") continue;
            const resultPaths = Fs.readdirSync(fileDirectory)
                .filter(x => Path.extname(x) == ".js")
                .map(x => Path.join(fileDirectory, x));
            result.push(...resultPaths)
        }
        return result;
    }

    getByCategory(category: MetaDataLoaderCategory):Kecubung.ParentMetaData[] {
        return this.storage.filter(x => x.category == category)
            .map(x => x.meta);
    }

    get(classId: string):Kecubung.ClassMetaData {
        let qualifiedName = this.idResolver.getClassName(classId)
        let classInfo = new QualifiedName(qualifiedName)
        let file = this.storage
            .map(x => x.meta)
            .filter(x => x.name == classInfo.fileName)[0]
        if (!file) return
        let result: Kecubung.MetaData = file;
        let found = false;
        for (let className of classInfo.className.split(".")) {
            for (let item of (<Kecubung.ParentMetaData>result).children) {
                if (item.name == className) {
                    found = true
                    if (item.type == "Class") {
                        return <Kecubung.ClassMetaData>item
                    }
                    else {
                        result = item;
                        break;
                    }
                }
            }
            if(!found) return
        }
    }
}