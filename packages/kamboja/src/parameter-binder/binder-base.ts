import { RouteInfo, HttpRequest } from "kamboja-core"

export interface BinderResult { type: "Next" | "Exit", value?: any }

export abstract class BinderBase {
    abstract bind(routeInfo: RouteInfo, parameterName: string, request: HttpRequest):BinderResult

    protected next(): BinderResult {
        return { type: "Next" }
    }
    protected exit(value: any): BinderResult {
        return { type: "Exit", value: value }
    }
}