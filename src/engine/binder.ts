import * as Core from "../core"


export class Binder{
    constructor(private routeInfo:Core.RouteInfo, private request:Core.HttpRequest){}

    //bind paramters based on GeneratingMethod (default, httpmethodgenerator, api convention)
    getParameters():Array<any>{
        return null;
    }
}