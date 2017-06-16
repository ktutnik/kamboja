import * as Kecubung from "kecubung"
import * as Core from "kamboja-core"


const META_DATA_KEY = "kamboja:Call.when";
export function when(kind: Kecubung.MetadataType) {
    return function (target, method, descriptor) {
        Reflect.defineMetadata(META_DATA_KEY, kind, target, method);
    }
}

export function getWhen(target, methodName: string) {
    return <Kecubung.MetadataType>Reflect.getMetadata(META_DATA_KEY, target, methodName);
}

export abstract class TransformerBase {
    protected transformers: TransformerBase[];

    abstract transform(meta: Kecubung.MetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult

    protected transformChildren(children: Kecubung.MetaData[], parent: string) {
        let result: Core.RouteInfo[] = []
        let lastResult: Core.TransformResult;
        for (let child of children) {
            let trans = this.transformers.filter(x => getWhen(x, "transform") == child.type)
            for (let transformer of trans) {
                let tempResult = transformer.transform(child, parent, lastResult ? lastResult.info : undefined)
                let exit = false;
                switch (tempResult.status) {
                    case "ExitWithResult":
                        result = result.concat(tempResult.info);
                        exit = true;
                        break;
                    case "Next":
                        lastResult = tempResult;
                        break;
                    case "Exit":
                        exit = true;
                        break;
                }
                if (exit) break;
            }
        }
        return result;
    }

    protected next(result?: Core.RouteInfo[] | Core.RouteInfo) {
        if (result)
            return <Core.TransformResult>{
                status: "Next",
                info: Array.isArray(result) ? result : [result]
            };
        else
            return <Core.TransformResult>{ status: "Next" };
    }

    protected exit(result?: Core.RouteInfo[] | Core.RouteInfo) {
        if (result) return <Core.TransformResult>{
            status: "ExitWithResult",
            info: Array.isArray(result) ? result : [result]
        };
        return <Core.TransformResult>{ status: "Exit" };
    }
}
