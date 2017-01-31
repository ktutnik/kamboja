import * as Core from "../core"

export class Binder{
    constructor(private routeInfo:Core.RouteInfo, private request:Core.HttpRequest){}

    getParameters():Array<any>{
        let result:any[] = []
        let routeParams = this.routeInfo.route 
            .split("/")
            .filter(x => x.charAt(0) == ":")
            .map(x => x.substring(1))
        for(let item of routeParams){
            result.push(this.request.getParam(item))
        }
        return result;
    }
}