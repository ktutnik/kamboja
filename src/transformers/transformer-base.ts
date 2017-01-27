import * as Kecubung from "kecubung"
import * as Core from "../core"

export abstract class TransformerBase {
    protected transformers: TransformerBase[];

    abstract transform(meta: Kecubung.MetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult

    protected transformChildren(children: Kecubung.MetaData[], parent: string) {
        let result: Core.RouteInfo[] = []
        let lastResult: Core.TransformResult;
        for (let child of children) {
            let trans = this.transformers.filter(x => Core.getWhen(x, "transform") == child.type)
            for (let transformer of trans) {
                let tempResult = transformer.transform(child, parent, lastResult ? lastResult.info : undefined)
                switch (tempResult.status) {
                    case "ExitWithResult":
                        result = result.concat(tempResult.info);
                        break;
                    case "Next":
                        lastResult = tempResult;
                        break;
                    case "Exit":
                        break;
                }
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
