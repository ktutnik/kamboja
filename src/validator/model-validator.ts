import * as Kecubung from "kecubung"
import { ValidatorCommandBase, decoratorName, getDecoratorName } from "./baseclasses"
import { ValidationError, IdentifierResolver } from "../core"
import { Validator } from "./validator"
import { MetaDataStorage } from "../metadata-storage"

export class ModelValidator extends ValidatorCommandBase {

    constructor(private idResolver: IdentifierResolver) {
        super()
    }

    @decoratorName("model")
    validate(value: any, metaData: Kecubung.ParameterMetaData | Kecubung.PropertyMetaData) {
        if (!value) return
        let modelName = this.getParameter(metaData, 0, "String")
        let storage = new MetaDataStorage(this.idResolver)
        let modelMetaData = storage.get(modelName)
        let errors:ValidationError[] = []
        for (let property of modelMetaData.properties) {
            for (let decorator of property.decorators) {
                let validator = Validator.getValidators().filter(x => getDecoratorName(x) == decorator.name)[0];
                if (validator) {
                    let errorMessage = validator.validate(value[property.name], property)
                    if (errorMessage)
                        errors.push(...errorMessage)
                }
            }
        }
        return errors.length > 0 ? errors : undefined
    }

}