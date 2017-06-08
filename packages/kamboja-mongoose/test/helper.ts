import * as Kecubung from "kecubung";
import * as Babylon from "babylon"
import * as Path from "path"
import * as Fs from "fs"
import { Core } from "kamboja"
import * as Mongoose from "mongoose"

function flatten(metaList: Kecubung.MetaData[], fileName: string): Core.QualifiedClassMetaData[] {
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
                    result.push(...clazz)
                }
                break;
            case "Class":
                let curClass = <Core.QualifiedClassMetaData>x
                curClass.qualifiedClassName = `${curClass.name}, ${fileName}`
                result.push(curClass)
                break;
        }
    })
    return result;
}

export function fromFile(filePath: string, pathResolver:Core.PathResolver) {
    let path = pathResolver.resolve(filePath)
    let code = Fs.readFileSync(path).toString()
    return fromCode(code, filePath)
}

export function fromCode(code, filePath: string = "") {
    let ast = Babylon.parse(code);
    let result = Kecubung.transform("ASTree", ast, filePath);
    return flatten(result.children, filePath)
}

function cleanupArray(obj: any) {
    let result:any[] = []
    obj.forEach(x => {
        let clean = cleanup(x)
        result.push(clean)
    })
    return result
}

export function cleanup(obj) {
    let exclude = ["_id", "__v"]
    let result:any = {}
    if(Array.isArray(obj)) return cleanupArray(obj)
    for (let key in obj) {
        if (exclude.some(x => x === key)) continue
        else if (typeof obj[key] == "object" && !(obj[key] instanceof Date)) result[key] = cleanup(obj[key])
        else result[key] = obj[key]
    }
    return result
}