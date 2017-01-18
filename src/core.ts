
export class Decorator {
    internal() { return (...keys: any[]) => { }; }
}

export class HttpDecorator {
    get(route?: string) { return (...keys: any[]) => { }; }
    post(route?: string) { return (...keys: any[]) => { }; }
    put(route?: string) { return (...keys: any[]) => { }; }
    delete(route?: string) { return (...keys: any[]) => { }; }
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"
export const internal = new Decorator().internal;
export const http = new HttpDecorator();

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