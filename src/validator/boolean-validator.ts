import * as Kecubung from "kecubung"
import {ValidatorCommand} from "./baseclasses"

export class ModelValidator implements ValidatorCommand{
    constructor(private value:any, private meta:Kecubung.ValueMetaData){}

    validate(){
        
    }
}