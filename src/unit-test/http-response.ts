import * as Core from "../core"

export class HttpResponse implements Core.HttpResponse {
    body: any
    type: string
    status: number
    cookies: Core.Cookie[]
    send(){}
};