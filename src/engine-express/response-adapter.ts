import * as Core from "../core"
import * as Express from "express"


export class ResponseAdapter implements Core.HttpResponse {
    constructor(private response: Express.Response) { }

    setCookie(key:string, value:string, option?:Core.CookieOptions){
        this.response.cookie(key, value, option)
    }

    json(body, status?:number) {
        if(status)
            this.response.json(status, body);
        else
            this.response.json(body)
     }

     jsonp(body, status?:number) {
        if(status)
            this.response.jsonp(status, body);
        else
            this.response.jsonp(body)
     }

     view(name, model?){
         this.response.render(name, model)
     }

     file(path:string){
         this.response.sendFile(path)
     }

     redirect(url:string){
         this.redirect(url)
     }
}