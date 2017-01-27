import {FileTransformer} from "./file"
import * as Kecubung from "kecubung"
import * as Core from "../core"

export function transform(file:Kecubung.ParentMetaData):Core.RouteInfo[]{
    let transformer = new FileTransformer()
    return transformer.transform(file, "", undefined).info;
}