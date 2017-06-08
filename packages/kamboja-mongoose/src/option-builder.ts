import { Core } from "kamboja"
import * as Kecubung from "kecubung"
import { SchemaOptions } from "mongoose"

function filter(x: Kecubung.PropertyMetaData, type) {
    return x.decorators
        && (x.name == type ||
            x.decorators.some(dec => dec.name == "timestamp"
                && dec.parameters
                && (<Kecubung.PrimitiveValueMetaData>dec.parameters[0])
                    .value == type))
}

export class OptionBuilder {
    getOption(meta: Core.QualifiedClassMetaData) {
        let opt = this.getTimeStampOption(meta)
        return opt
    }

    private getTimeStampOption(meta: Core.QualifiedClassMetaData) {
        let result: SchemaOptions;
        if(!meta.properties) return
        let createAtQuery = meta.properties.filter(x => filter(x, "createdAt"))
        if (createAtQuery.length > 1) throw new Error(`Model ${meta.name} contains more than one @mongoose.timestamp("createdAt") decorator, only one allowed`)

        let updateAtQuery = meta.properties.filter(x => filter(x, "updatedAt"))
        if (updateAtQuery.length > 1) throw new Error(`Model ${meta.name} contains more than one @mongoose.timestamp("updatedAt") decorator, only one allowed`)

        if (createAtQuery.length == 1) {
            result = { timestamps: {} };
            (<any>result.timestamps).createdAt = createAtQuery[0].name
        }

        if (updateAtQuery.length == 1) {
            if (!result) result = { timestamps: {} };
            (<any>result.timestamps).updatedAt = updateAtQuery[0].name
        }
        return result;
    }
}