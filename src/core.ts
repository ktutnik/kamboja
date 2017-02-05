import { MetaData, MetadataType, MethodMetaData, ClassMetaData } from "kecubung";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"
export type TransformStatus = "ExitWithResult" | "Next" | "Exit"
export type TransformerName = "DefaultAction" | "IndexAction" | "HttpMethodDecorator" | "ApiConvention" | "InternalDecorator" | "Controller" | "Module"

export class Decorator {
    internal() { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
}

export class HttpDecorator {
    get(route?: string) { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
    post(route?: string) { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
    put(route?: string) { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
    delete(route?: string) { return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => { }; }
}

export type DecoratorType = keyof Decorator | keyof HttpDecorator;

export class Validator {
    string(required = false, length?: number) { }
}

export namespace RouteAnalysisCode {

    /**
     * Issue when route parameters doesn't have association
     * with action parameters
     */
    export const UnAssociatedParameters = 1;

    /**
     * Only applied on GET method, issue when action contains parameter
     * but route doesn't have any
     */
    export const MissingRouteParameters = 2;

    /**
     * Issue when router contains parameter, but action doesn't have any
     */
    export const MissingActionParameters = 3;

    /**
     * Issue when @internal decorator combined with other http method decorator
     */
    export const ConflictDecorators = 4;

    /**
     * API Convention fail because appropriate method name is match with
     * method naming convention but the method doesn't have parameters
     */
    export const ConventionFail = 5;

    export const ClassNotInheritedFromController = 6

    export const ClassNotExported = 7

    export const DuplicateRoutes = 8
}

export interface RouteAnalysis {
    code: number
    type: "Error" | "Warning"
    message: string
}

/**
 * ask the next transformer to override each of field if possible
 */
export enum OverrideRequest {
    Route = 1,
    HttpMethod = 2,
}

export interface RouteInfo {
    /**
     * Transformer initiate the info
     */
    initiator?: TransformerName

    /**
     * Transformer collaborate to change the info
     */
    collaborator?: TransformerName[]

    /**
     * Message for next transformer to override specific field
     */
    overrideRequest?: OverrideRequest
    route?: string;
    httpMethod?: HttpMethod
    methodMetaData?: MethodMetaData
    classMetaData?: ClassMetaData
    qualifiedClassName?: string
    classId?: any
    analysis?: number[]
}

export interface TransformResult {
    status: TransformStatus
    info?: RouteInfo[]
}

export interface KambojaOption {
    skipAnalysis?: boolean
    showConsoleLog?: boolean
    overrideAppEngine?: (app) => void
    controllerPaths?: string[],
    viewPath?: string,
    viewEngine?: string,
    staticFilePath?: string,
    dependencyResolver?: DependencyResolver
    identifierResolver?: IdentifierResolver
    errorHandler?: (err: HttpError) => void
}

export interface ExecutorCommand {
    execute(parameters: any[]): Promise<ActionResult>
}

export interface Engine {
    init(routes: RouteInfo[], option: KambojaOption): any;
}

export interface HttpRequest {
    httpVersion: string
    httpMethod: HttpMethod
    headers: { [key: string]: string }
    cookies: { [key: string]: string }
    params: { [key: string]: string }
    body: any
    referrer: string
    url: string
    getHeader(key: string): string
    getCookie(key: string): string
    getParam(key: string): string
}


export interface Cookie {
    key: string
    value: string
    options?: CookieOptions
}

export interface CookieOptions {
    maxAge?: number;
    signed?: boolean;
    expires?: Date | boolean;
    httpOnly?: boolean;
    path?: string;
    domain?: string;
    secure?: boolean | "auto";
}

export interface HttpResponse {
    setCookie(key: string, value: string, option?: CookieOptions)
    status(status: number, message?: string)
    json(body, status?: number)
    jsonp(body, status?: number)
    error(error, status?: number)
    view(name, model?)
    redirect(url: string)
    file(path: string)
    end()
}

export class HttpError {
    constructor(public status: number,
        public error,
        public request: HttpRequest,
        public response: HttpResponse) { }
}

export interface DependencyResolver {
    resolve<T>(qualifiedClassName: string);
}

export interface IdentifierResolver {
    getClassId(qualifiedClassName: string)
}

export class ActionResult {
    constructor(public cookies: Cookie[]) { }

    execute(response: HttpResponse,
        routeInfo: RouteInfo) {
        if(!this.cookies) return
        for(let cookie of this.cookies){
            response.setCookie(cookie.key, cookie.value, cookie.options)
        }
    }
}

export function getMethodName(info: RouteInfo) {
    const tokens = info.qualifiedClassName.split(",")
    const method = `${tokens[0].trim()}.${info.methodMetaData.name}`
    const file = tokens[1].trim()
    return `[${method} ${file}]`;
}

export const internal = new Decorator().internal;
export const http = new HttpDecorator();
export const val = new Validator();
export { ApiController, Controller } from "./controller"

