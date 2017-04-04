import { MetaData, ParentMetaData, MetadataType, MethodMetaData, ClassMetaData } from "kecubung";
import * as Kecubung from "kecubung"
import * as Url from "url"

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
export type TransformStatus = "ExitWithResult" | "Next" | "Exit"
export type TransformerName = "DefaultAction" | "IndexAction" | "HttpMethodDecorator" | "ApiConvention" | "InternalDecorator" | "Controller" | "Module"
export type MetaDataLoaderCategory = "Controller" | "Model"
export const ValidationTypesAccepted = ["string", "string[]", "number", "number[]", "boolean", "boolean[]", "date", "date[]"]

export type InterceptorFactory = (opt:KambojaOption) => string | string[] | RequestInterceptor | RequestInterceptor[]

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

export interface AnalysisMessage {
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
    classPath?: string
    methodPath?: string
}

export interface TransformResult {
    status: TransformStatus
    info?: RouteInfo[]
}

export interface FieldValidatorArg {
    value: any
    field: string
    parentField?: string
    decoratorArgs: Kecubung.ValueMetaData[]
    classInfo: Kecubung.ClassMetaData
}

export interface ValidatorCommand {
    validate(args: FieldValidatorArg)
}

export interface Facade {
    dependencyResolver?: DependencyResolver
    identifierResolver?: IdentifierResolver
    pathResolver?: PathResolver
    validators?: (ValidatorCommand | string)[]
    metaDataStorage?: MetaDataStorage
    interceptors?: (RequestInterceptor | string)[]
    autoValidation?: boolean
}

export interface KambojaOption extends Facade {
    skipAnalysis?: boolean
    showConsoleLog?: boolean
    overrideAppEngine?: (app) => void
    controllerPaths?: string[]
    viewPath?: string
    viewEngine?: string
    staticFilePath?: string
    modelPath?: string
    errorHandler?: (err: HttpError) => void
    rootPath: string
    defaultPage?: string
}

export interface MetaDataStorage {
    pathResolver: PathResolver
    get(classId: string): QualifiedClassMetaData
    getFiles(category: MetaDataLoaderCategory): Kecubung.ParentMetaData[]
    getClasses(category: MetaDataLoaderCategory): QualifiedClassMetaData[]
}

export interface Engine {
    init(routes: RouteInfo[], option: KambojaOption): any;
}

export interface ValidationError {
    field: string,
    message: string
}

export interface Validator {
    isValid(): boolean
    getValidationErrors(): ValidationError[]
}

export interface BaseController {
    request: HttpRequest;
    validator: Validator;
}

export interface HttpRequest {
    httpVersion: string
    httpMethod: HttpMethod
    headers: { [key: string]: string }
    cookies: { [key: string]: string }
    params: { [key: string]: string }
    user: any
    body: any
    referrer: string
    url: Url.Url
    getHeader(key: string): string
    getCookie(key: string): string
    getParam(key: string): string
    isAccept(mime: string): boolean
    isAuthenticated(): boolean
    getUserRole():string
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
    removeCookie(key: string, option?: CookieOptions)
    setContentType(type: string)
    status(status: number, message?: string)
    json(body, status?: number)
    jsonp(body, status?: number)
    error(error, status?: number)
    view(name, model?)
    redirect(url: string)
    file(path: string)
    send(body?)
    end()
}

export class HttpError {
    constructor(public status: number,
        public error,
        public request: HttpRequest,
        public response: HttpResponse) { }
}

export abstract class Invocation {
    abstract execute(): Promise<ActionResult>
    url: Url.Url
    request: HttpRequest
    methodName: string
    classMetaData: Kecubung.ClassMetaData
    parameters: any[]
    interceptors: RequestInterceptor[]
    hasController() {
        return typeof this.classMetaData == "object"
    }
}

export interface RequestInterceptor {
    intercept(invocation: Invocation): Promise<ActionResult>;
}

export interface DependencyResolver {
    resolve<T>(qualifiedClassName: string);
}

export interface IdentifierResolver {
    getClassId(qualifiedClassName: string)
    getClassName(classId: string)
}

export interface PathResolver {
    resolve(path: string)
    relative(absolute: string)
    normalize(path: string)
}

export class ActionResult {
    private contentType: string;
    private removedCookie: { key: string, options?: CookieOptions }[] = []
    cookies: Cookie[]

    constructor(cookies: Cookie[]) {
        this.cookies = cookies || []
    }

    setCookie(cookie: Cookie) {
        this.cookies.push(cookie)
    }

    removeCookie(key: string, options?: CookieOptions) {
        this.removedCookie.push({ key: key, options: options })
    }

    setContentType(type: string) {
        this.contentType = type;
    }

    execute(request:HttpRequest, response: HttpResponse, routeInfo: RouteInfo) {
        if (this.contentType) response.setContentType(this.contentType)
        this.removedCookie.forEach(x => response.removeCookie(x.key, x.options))
        this.cookies.forEach(x => response.setCookie(x.key, x.value, x.options))
    }
}

export function getRouteDetail(info: RouteInfo) {
    const tokens = info.qualifiedClassName.split(",")
    const method = `${tokens[0].trim()}.${info.methodMetaData.name}`
    const file = tokens[1].trim()
    return `[${method} ${file}]`;
}

export interface QualifiedClassMetaData extends Kecubung.ClassMetaData {
    qualifiedClassName: string
}

export namespace MetaDataHelper {
    export function save(key: string, value: any, args: any[]) {
        if (args.length == 1) {
            let collections = Reflect.getMetadata(key, args[0]) || []
            collections.push(value);
            Reflect.defineMetadata(key, collections, args[0])
        }
        else {
            let collections = Reflect.getMetadata(key, args[0], args[1]) || []
            collections.push(value);
            Reflect.defineMetadata(key, collections, args[0], args[1])
        }
    }

    export function get<T>(key: string, target: any, methodName?: string) {
        if (!target) return []
        if (!methodName) {
            let collections: T[] = Reflect.getMetadata(key, target.constructor)
            return collections
        }
        else {
            let collections: T[] = Reflect.getMetadata(key, target, methodName)
            return collections
        }
    }
}