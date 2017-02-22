import { Invocation, HttpResponse, HttpRequest, ExecutorCommand } from "../core"
import * as Kecubung from "kecubung"

export class DefaultInvocation implements Invocation{
    methodName:string
    classMetaData: Kecubung.ClassMetaData
    httpRequest:HttpRequest
    httpResponse:HttpResponse
    returnValue: any;
    parameters: any[]

    constructor(private executor:ExecutorCommand){

    }

    execute(): void{
        
    }
}