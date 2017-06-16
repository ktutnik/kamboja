import { RouteInfo, AnalysisMessage } from "kamboja-core"
import * as Index from "./definitions"
import { MissingActionParameterAnalyzer } from "./missing-action-parameter"
import { MissingRouteParameterAnalyzer } from "./missing-route-parameter"
import { UnassociatedParameterAnalyzer } from "./non-associated-parameter"
import { DuplicateRouteAnalyzer } from "./duplicate-route"
import { ConflictInternalDecoratorAnalyzer } from "./conflict-internal-decorator"
import { ConventionFailDecoratorAnalyzer } from "./convention-fail"
import { ClassNotInherritedFromControllerAnalyzer } from "./class-not-controller"
import { ClassNotExportedControllerAnalyzer } from "./class-not-exported"
import { ReservedWordUsedAnalyzer } from "./reserved-word-used"

export class RouteAnalyzer {
    private commands: Index.AnalyzerCommand[];
    constructor(private routes: RouteInfo[]) {
        this.commands = [
            new MissingActionParameterAnalyzer(),
            new MissingRouteParameterAnalyzer(),
            new UnassociatedParameterAnalyzer(),
            new DuplicateRouteAnalyzer(),
            new ConflictInternalDecoratorAnalyzer(),
            new ConventionFailDecoratorAnalyzer(),
            new ClassNotInherritedFromControllerAnalyzer(),
            new ClassNotExportedControllerAnalyzer(),
            new ReservedWordUsedAnalyzer(),
        ]
    }

    analyse(): AnalysisMessage[] {
        let result: AnalysisMessage[] = []
        for (let route of this.routes)
            for (let command of this.commands) {
                let analysis = command.analyse(route)
                if (analysis)
                    result = result.concat(analysis)
            }
        return result;
    }
}
