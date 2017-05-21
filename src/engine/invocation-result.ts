import { ActionResult, HttpRequest, HttpResponse, RouteInfo, } from "../core"

export namespace InvocationResult {
    export async function create(result, status?:number, type?:string) {
        let awaitedResult = await Promise.resolve(result)
        if (awaitedResult instanceof ActionResult)
            return awaitedResult
        return new ActionResult(awaitedResult, status, type)
    }
}