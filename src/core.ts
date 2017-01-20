import { MetaData } from "kenanga";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"
export type VisitStatus = "Complete" | "NextWithAnalysis" | "Next" | "Exit"
export type GeneratingMethod = "Default" | "HttpMethodDecorator" | "ApiConvention"

export class Decorator {
    internal() { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
}

export class HttpDecorator {
    get(route?: string) { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
    post(route?: string) { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
    put(route?: string) { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
    delete(route?: string) { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
}

export class Validator {
    string(required = false, length?: number) { }
}

export class RouteAnalysis {
    type: "Error" | "Warning"
    message: string;
}

export interface RouteInfo {
    generatingMethod?: GeneratingMethod
    route?: string;
    httpMethod?: HttpMethod
    parameters?: string[]
    className?: string
    methodName?: string
    classId?: any
    analysis?: RouteAnalysis[]
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

export interface RequestHandler {
    routeInfo: RouteInfo
    onRequest(request: HttpRequest, response:HttpResponse);
}

export interface Engine {
    register(handler: RequestHandler):Engine;
    listen(port:number)
}

export interface HttpRequest {
    httpVersion:string
    httpMethod:HttpMethod
    headers: { [key: string]: string }
    cookies: { [key: string]: string }
    queries: { [key: string]: string }
    body: any
    referrer: string
    url: string
    getHeader(key: string): string
    getCookie(key: string): string
    getQuery(key: string): string
}


export interface CookieOptions {
    maxAge?: number;
    signed?: boolean;
    expires?: Date | boolean;
    httpOnly?: boolean;
    path?: string;
    domain?: string;
    secure?: boolean | 'auto';
}

export interface HttpResponse {
    setCookie(key:string, value:string, option?:CookieOptions)

    json(body, status?:number)

     jsonp(body, status?:number)

     view(name, model?)
}

export interface DependencyResolver {
    resolve<T>(qualifiedClassName: string);
    getClassId(qualifiedClassName: string, objectInstance: any)
}

export interface Controller{
    request:HttpRequest
    response:HttpResponse
    view(viewName, model?);
}

export const internal = new Decorator().internal;
export const http = new HttpDecorator();
export const val = new Validator();
