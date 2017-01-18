import { MetaData } from "kenanga";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"
export type VisitStatus = "Complete" | "NextWithAnalysis" | "Next" | "Exit"

export class Decorator {
    internal() { return (...keys: any[]) => { }; }
}

export class HttpDecorator {
    get(route?: string) { return (...keys: any[]) => { }; }
    post(route?: string) { return (...keys: any[]) => { }; }
    put(route?: string) { return (...keys: any[]) => { }; }
    delete(route?: string) { return (...keys: any[]) => { }; }
}

export class RouteAnalysis {
    type: "Error" | "Warning"
    message: string;
}

export interface RouteInfo {
    route: string;
    method: HttpMethod
    parameters: string[]
    className: string
    analysis: RouteAnalysis[]
}

export interface MethodVisitor {
    visit(meta: MetaData, parent: string): MethodVisitorResult;
}

export interface MethodVisitorResult {
    status: VisitStatus
    result?: RouteInfo
}

export interface ClassVisitor {
    visit(meta: MetaData, parent: string): RouteInfo[]
}

export interface Generator {
    fileName: string,
    traverseArray(children: MetaData[], parent: string): RouteInfo[];
    traverseMeta(meta: MetaData, parent: string): RouteInfo[];
}

export interface GeneratorOption {
    stripeController?: boolean
    internalDecorator?: boolean
    httMethodDecorator?: boolean
    apiConvention?: boolean
}

export interface HttpRequest {
    header: { [key: string]: string }
    cookie: { [key: string]: string }
    getHeader(key: string): string;
    getCookie(key: string): string
}

export const internal = new Decorator().internal;
export const http = new HttpDecorator();
