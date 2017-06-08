import * as Core from "kamboja-core"

export class HttpResponse implements Core.HttpResponse {
    body: any
    type: string
    status: number
    header: { [key: string]: string | string[] }
    cookies: Core.Cookie[]
    send() { }
};