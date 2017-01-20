import * as Core from "../core"
import * as Express from "express"
import * as Utils from "../utils"


export class RequestAdapter implements Core.HttpRequest {
    httpVersion:string
    httpMethod:Core.HttpMethod
    headers: { [key: string]: string }
    cookies: { [key: string]: string }
    queries: { [key: string]: string }
    body: any
    referrer: string
    url: string

    constructor(request: Express.Request) { 
        Utils.copy(request.header, this.headers)
        Utils.copy(request.cookies, this.cookies)
        Utils.copy(request.params, this.queries)
        Utils.copy(request.query, this.queries)
        this.body = request.body;
        this.httpVersion = request.httpVersion;
        this.httpMethod = <Core.HttpMethod>request.method;
        this.url = request.originalUrl;
        this.referrer = request.header("referrer");
    }

    getHeader(key: string): string { return this.headers[key.toLowerCase()]; }
    getCookie(key: string): string { return this.cookies[key.toLowerCase()]; }
    getQuery(key: string): string { return this.queries[key.toLowerCase()]; }
}