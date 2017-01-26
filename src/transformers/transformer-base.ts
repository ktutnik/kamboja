import * as Kecubung from "kecubung"
import * as Core from "../core"

export abstract class TransformerBase {
    transformers: TransformerBase[];

    abstract transform(meta: Kecubung.MetaData, parent: string, prevResult: Core.RouteInfo[]): Core.TransformResult

    protected traverse(children: Kecubung.MetaData[], parent: string) {
        let result: Core.RouteInfo[] = []
        for (let child of children) {
            let executeResult = this.executeByPriority(child, parent)
            if (executeResult) result = result.concat(executeResult)
        }
        return result;
    }

    protected next(result?: Core.RouteInfo[]) {
        if (result)
            return <Core.TransformResult>{
                status: "NextWithResult",
                info: result
            };
        else
            return <Core.TransformResult>{ status: "Next" };
    }

    protected exit(result?: Core.RouteInfo[]) {
        if (result) return <Core.TransformResult>{
            status: "ExitWithResult",
            info: result
        };
        return <Core.TransformResult>{ status: "Exit" };
    }

    private executeByPriority(child: Kecubung.MetaData, parent: string) {
        let trans = this.transformers.filter(x => Core.getWhen(x, "transform") == child.type)
        let lastResult: Core.TransformResult;
        for (let transformer of trans) {
            let result = transformer.transform(child, parent, lastResult.info)
            switch (result.status) {
                case "ExitWithResult":
                    return result.info;
                case "NextWithResult":
                    lastResult = result;
                case "Exit":
                    return;
            }
        }
        return;
    }
}
