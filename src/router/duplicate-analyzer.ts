import { RouteInfo } from "../core"
import { RouteAnalysis, AnalyzerCommand, getMethodName } from "./index"

export class DuplicateAnalyzer implements AnalyzerCommand {
    routes: RouteInfo[] = []
    analyse(route: RouteInfo): RouteAnalysis[] {
        let dupe = this.routes.filter(x => x.route == route.route);
        if (dupe.length > 0) {
            let message = `Duplicate route ${route.route} on ${getMethodName(route)} and ${getMethodName(dupe[0])}`
            return [{
                message: message,
                type: "Error"
            }];
        }
        else {
            this.routes.push(route);
            return;
        }
    }
}