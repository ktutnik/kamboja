import * as Path from "path"
import { PathResolver } from "./path-resolver"


export class QualifiedName {
    className: string
    fileName: string
    constructor(private qualifiedName: string) {
        let tokens = this.qualifiedName.split(",")
        if (tokens.length != 2) throw new Error("Provided name is not qualified [ClassName, the/path/of/file]")
        this.className = tokens[0].trim()
        let fileRaw = tokens[1].trim()
        this.fileName = PathResolver.normalize(fileRaw)
    }

    equals(qualifiedName) {
        let qualified = new QualifiedName(qualifiedName)
        return this.className === qualified.className
            && this.fileName === qualified.fileName
    }
}

