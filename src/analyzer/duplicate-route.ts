import { RouteAnalysis, RouteInfo, RouteAnalysisCode } from "../core"
import { AnalyzerCommand, getMethodName } from "./definitions"

export class DuplicateRouteAnalyzer implements AnalyzerCommand {
    routes: RouteInfo[] = []
    analyse(route: RouteInfo): RouteAnalysis[] {
        let dupe = this.routes.filter(x => x.route == route.route);
        if (dupe.length > 0) {
            let message = `Duplicate route [${route.route}] on ${getMethodName(route)} and ${getMethodName(dupe[0])}`
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