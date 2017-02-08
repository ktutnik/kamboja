import * as Kecubung from "kecubung"
import {ValidatorCommand} from "./baseclasses"

export class ModelValidator implements ValidatorCommand{
    constructor(private model:any, private meta:Kecubung.DecoratorMetaData){}

    validate(){

    }
}