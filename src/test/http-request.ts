import * as Core from "../core"
import * as Url from "url"

export class HttpRequest implements Core.HttpRequest {
    httpVersion: string
    httpMethod: Core.HttpMethod
    headers: { [key: string]: string }
    cookies: { [key: string]: string }
    params: { [key: string]: string }
    body: any
    referrer: string
    url: Url.URL
    user: any
    getHeader(key: string): string { return }
    getCookie(key: string): string { return }
    getParam(key: string): string { return }
    isAccept(mime: string) { return false }
    isAuthenticated() { return false }
    getUserRole() { return "" }
    controllerInfo?: Core.ControllerInfo
    middlewares?: Core.Middleware[]
    route:string
}