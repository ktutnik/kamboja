import { MetaDataLoaderCategory, PathResolver, IdentifierResolver, MetaDataStorage, QualifiedClassMetaData } from "kamboja-core"
import { DefaultPathResolver } from "../resolver/path-resolver"
import { QualifiedName } from "../resolver/qualified-name"
import * as Fs from "fs"
import * as Path from "path"
import * as Kecubung from "kecubung"
import * as Babylon from "babylon"

function flatten(metaList: Kecubung.MetaData[], fileName: string): QualifiedClassMetaData[] {
    let result = []
    metaList.forEach(x => {
        switch (x.type) {
            case "Module":
                let file = <Kecubung.ParentMetaData>x;
                let clazz = flatten(file.children, fileName)
                if (clazz && clazz.length > 0) {
                    clazz.forEach(cls => {
                        cls.qualifiedClassName = file.name + "." + cls.qualifiedClassName
                    })
                    result = result.concat(clazz)
                }
                break;
            case "Class":
                let curClass = <QualifiedClassMetaData>x
                curClass.qualifiedClassName = `${curClass.name}, ${fileName}`
                result.push(curClass)
                break;
        }
    })
    return result;
}

export class MetaDataLoader implements MetaDataStorage {
    private flatStorage: { [key: string]: QualifiedClassMetaData[] } = {}
    private storage: { [key: string]: Kecubung.ParentMetaData[] } = {}
    constructor(private idResolver: IdentifierResolver, public pathResolver:PathResolver) { }

    load(path: string | string[], category: MetaDataLoaderCategory) {
        let files: string[]
        if (typeof path == "string") files = this.getFilePaths([path], category)
        else files = this.getFilePaths(path, category)
        let flatResult: QualifiedClassMetaData[] = []
        let result: Kecubung.ParentMetaData[] = []
        for (let file of files) {
            let code = Fs.readFileSync(file).toString()
            let ast = Babylon.parse(code)
            let fileName = this.pathResolver.normalize(file)
            let meta = Kecubung.transform("ASTree", ast, fileName)
            flatResult = flatResult.concat(flatten(meta.children, meta.name))
            result.push(meta)
        }
        this.flatStorage[category] = flatResult;
        this.storage[category] = result;
    }

    private getFilePaths(paths: string[], category: MetaDataLoaderCategory) {
        let result: string[] = []
        for (const path of paths) {
            const fileDirectory = this.pathResolver.resolve(path)
            if (!Fs.existsSync(fileDirectory) && category == "Controller") throw Error(`Directory not found [${path}]`);
            if (!Fs.existsSync(fileDirectory) && category == "Model") continue;
            const resultPaths = Fs.readdirSync(fileDirectory)
                .filter(x => Path.extname(x) == ".js")
                .map(x => Path.join(fileDirectory, x));
            result = result.concat(resultPaths)
        }
        return result;
    }

    getFiles(category: MetaDataLoaderCategory): Kecubung.ParentMetaData[] {
        return this.storage[category];
    }

    getClasses(category: MetaDataLoaderCategory): QualifiedClassMetaData[] {
        return this.flatStorage[category]
    }

    get(classId: string): QualifiedClassMetaData {
        let request = new QualifiedName(classId, this.pathResolver)
        for (let key in this.flatStorage) {
            let result = this.flatStorage[key].filter(x => {
                let qualified = new QualifiedName(x.qualifiedClassName, this.pathResolver)
                return request.equals(qualified)
            })
            if (result.length > 0) return result[0]
        }
    }
}