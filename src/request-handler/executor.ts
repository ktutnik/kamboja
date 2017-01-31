import * as Core from "../core"

export class Executor{
    //execute controller based on controller type: APIController or Controller
    constructor(private routeInfo:Core.RouteInfo, resolver:Core.DependencyResolver, response:Core.HttpResponse){}
    execute(parameters:any[]){}
}