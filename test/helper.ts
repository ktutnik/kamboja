import * as Kecubung from "kecubung";
import * as Babylon from "babylon"

export function transform(code:string, filename:string = "dummy.js"){
    let ast = Babylon.parse(code);
    return Kecubung.transform(ast, filename);
}

