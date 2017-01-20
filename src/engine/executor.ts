import * as Core from "../core"

export class Executor{
    //execute controller based on controller type: APIController or Controller
    constructor(private controller, private method:string, response:Core.HttpResponse){}
    execute(){}
}