import * as Kecubung from "kecubung";
import * as Babylon from "babylon"
import * as Path from "path"
import * as Fs from "fs"
import * as Core from "../src/core"

export function fromFile(filePath:string){
    let path = Path.join(process.cwd(), filePath)
    let code = Fs.readFileSync(path).toString()
    return fromCode(code, filePath)
}

export function fromCode(code, filePath:string = ""){
let ast = Babylon.parse(code);
    return Kecubung.transform("ASTree", ast, filePath);
}

export function cleanUp(info: Core.RouteInfo[]) {
    return info.map(x => {
        let result: any = {
            initiator: x.initiator,
            route: x.route,
            httpMethod: x.httpMethod,
            methodMetaData: {
                name: x.methodMetaData ? x.methodMetaData.name : ""
            },
            className: x.className,
            baseClass: x.baseClass,
            collaborator: x.collaborator,
        }
        if (x.analysis) result.analysis = x.analysis
        return result;
    });
}

