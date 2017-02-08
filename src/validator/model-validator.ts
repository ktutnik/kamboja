import * as Kecubung from "kecubung"

export class ModelValidator implements Validator{
    constructor(private model:any, private meta:Kecubung.DecoratorMetaData){}

    validate(){
        
    }
}