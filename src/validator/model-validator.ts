import * as Kecubung from "kecubung"
import { ValidatorCommand, ValidatorParams, transform } from "./baseclasses"
import { ValidationError, IdentifierResolver } from "../core"
import { MetaDataStorage } from "../metadata-storage"

export class ModelValidator implements ValidatorCommand {

    constructor(private model: any, private fieldName: string,
        private decoratorParameters: Kecubung.ValueMetaData[],
        private idResolver: IdentifierResolver) { }

    validate() {
        let firstParam = <Kecubung.PrimitiveValueMetaData>this.decoratorParameters[0]
        let modelName = firstParam.value;
        let storage = new MetaDataStorage(this.idResolver)
        let modelMetaData = storage.get(modelName)
        return <ValidationError[]>{}
    }

}