import { ValidatorParams } from "./baseclasses"
import * as Kecubung from "kecubung"

/*
{
    type: "Boolean",
    value: true
}

{
    type: "Object",
    properties: [{
        type: "Boolean",
        name: "required",
        value: true
    }, {
        type: "Boolean",
        name: "message",
        value: ""
    }, {
        type: "Number",
        name: "max",
        value: 200
    }, {
        type: "Number",
        name: "min",
        value: 1
    }]
}
*/

export function transform(meta:Kecubung.ValueMetaData):ValidatorParams{
    if(meta.type == "Boolean"){
        return { 
            required: (<Kecubung.PrimitiveValueMetaData>meta).value
        }
    }
    else {
        let option = <Kecubung.ObjectValueMetaData>meta;
        let result:any = {}
        for(let prop of option.properties){
            result[prop.name] = (<Kecubung.PrimitiveValueMetaData>prop).value
        }
        return result;
    }
}