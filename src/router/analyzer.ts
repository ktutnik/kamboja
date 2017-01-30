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

export class DuplicateAnalyzer implements AnalyzerCommand {
    routes: RouteInfo[] = []
    analyse(route: RouteInfo): RouteAnalysis[] {
        let dupe = this.routes.filter(x => x.route == route.route);
        if (dupe.length > 0) {
            let message = `Error: duplicate`
        }
        else {
            this.routes.push(route);
        }
    }
}