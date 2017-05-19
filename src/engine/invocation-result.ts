import { ActionResult, HttpRequest, HttpResponse, RouteInfo } from "../core"
import { ApiActionResult } from "../controller"

export namespace InvocationResult {
    export async function create(result) {
        let awaitedResult = await Promise.resolve(result)
        if (awaitedResult instanceof ActionResult)
            return awaitedResult
        return new ActionResult(awaitedResult)
    }
}