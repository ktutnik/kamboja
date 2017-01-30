import * as Kecubung from "kecubung";
import * as Babylon from "babylon"
import * as Path from "path"
import * as Fs from "fs"

export function fromFile(filePath:string){
    let path = Path.join(process.cwd(), filePath)
    let code = Fs.readFileSync(path).toString()
    return fromCode(code, filePath)
}

export function fromCode(code, filePath:string = ""){
let ast = Babylon.parse(code);
    return Kecubung.transform("ASTree", ast, filePath);
}

