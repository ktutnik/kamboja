import * as Core from "./core"
import * as Utils from "./utils"
import {DefaultResolver} from "./resolver"

export interface KambojaOption{
    engine?:Core.Engine,
    controllerPath?: string,
    apiControllerPath:string,
}

export class Kamboja{
    engine:Core.Engine;
    option:KambojaOption;

    private static resolver:Core.DependencyResolver = new DefaultResolver();

    static registerResolver(resolver:Core.DependencyResolver){
        Kamboja.resolver = resolver;
    }


    constructor(option?:KambojaOption){
        this.option = Utils.override(option, {
            engine: this.createDefaultEngine(),
            controllerPath: "./controller",
            apiControllerPath: "./api"
        })
    }

    private init(){

    }

    private createDefaultEngine():Core.Engine{
        return null;
    }
    


    listen(port:number){
        this.engine.listen(port)
    }
}

export class RouteInfoLoader{
    constructor(private path:string, private resolver:Core.DependencyResolver){}
    
    load(){
        
    }
}