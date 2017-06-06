import * as Path from "path"
import { PathResolver } from "../core"
import { Kamboja } from "../kamboja"

export class QualifiedName {
    className: string
    fileName: string
    private valid: boolean;
    private array: boolean;
    constructor(public qualifiedName: string, private pathResolver:PathResolver) {
        let tokens = this.qualifiedName.split(",")
        if (tokens.length != 2) {
            this.valid = false;
        }
        else {
            this.valid = true;
            this.className = tokens[0].trim()
            this.array = this.className.indexOf("[]", this.className.length - 2) != -1
            if (this.array) {
                this.className = this.className.substr(0, this.className.length - 2)
            }
            let fileRaw = tokens[1].trim()
            this.fileName = pathResolver.normalize(fileRaw)
            this.qualifiedName = `${this.className}, ${this.fileName}`
        }
    }

    isValid() {
        return this.valid;
    }

    equals(qualifiedName: string | QualifiedName) {
        let qualified: QualifiedName;
        if (typeof qualifiedName == "string")
            qualified = new QualifiedName(qualifiedName, this.pathResolver)
        else qualified = qualifiedName
        return this.className === qualified.className
            && this.fileName === qualified.fileName
    }

    isArray() {
        return this.array
    }
}

