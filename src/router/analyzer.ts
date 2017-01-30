import { RouteInfo } from "../core"
import { RouteAnalysis, AnalyzerCommand } from "./index"

export class RouteAnalyzer {
    private commands: AnalyzerCommand[];
    constructor(private routes: RouteInfo[]) {

    }

    analyse(): RouteAnalysis[] {
        let result: RouteAnalysis[] = []
        for (let route of this.routes)
            for (let command of this.commands)
                result = result.concat(command.analyse(route))
        return result;
    }
}
