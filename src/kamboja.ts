import * as Core from "./core"
import * as Utils from "./utils"
import {DefaultResolver} from "./resolver"

export interface KambojaOption{
    engine?:Core.Engine,
    controllerPath?: string,
    onAppSetup?:(app) => void
}

export class Kamboja{
    engine:Core.Engine;
    option:KambojaOption;

    private static resolver:Core.DependencyResolver = new DefaultResolver();

    static registerResolver(resolver:Core.DependencyResolver){
        Kamboja.resolver = resolver;
    }


    constructor(option?:KambojaOption){
        this.option = Utils.override(option,<KambojaOption> {
            engine: this.createDefaultEngine(),
            controllerPath: "./controller",
            onAppSetup: (app):void => {}
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