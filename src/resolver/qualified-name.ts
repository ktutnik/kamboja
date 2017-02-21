import * as Path from "path"
import { PathResolver } from "./path-resolver"


export class QualifiedName {
    className: string
    fileName: string
    private valid: boolean;
    constructor(public qualifiedName: string) {
        let tokens = this.qualifiedName.split(",")
        if (tokens.length != 2) {
            this.valid = false;
        }
        else {
            this.valid = true;
            this.className = tokens[0].trim()
            let fileRaw = tokens[1].trim()
            let pathResolver = new PathResolver()
            this.fileName = pathResolver.normalize(fileRaw)
            this.qualifiedName = `${this.className}, ${this.fileName}`
        }
    }

    isValid() {
        return this.valid;
    }

    equals(qualifiedName) {
        let qualified = new QualifiedName(qualifiedName)
        return this.className === qualified.className
            && this.fileName === qualified.fileName
    }
}

