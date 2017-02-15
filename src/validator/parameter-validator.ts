import * as Kecubung from "kecubung"
import { ValidatorCommandBase, decoratorName, getDecoratorName } from "./baseclasses"
import * as Core from "../core"
import { Validator } from "./validator"
import { InMemoryMetaDataStorage } from "../metadata-storage"

export class ParameterValidator extends ValidatorCommandBase {

    constructor(
        private metaDataStorage: Core.MetaDataStorage,
        private validators: Core.ValidatorCommand[]) {
        super()
    }

    @decoratorName("type")
    validate(value, meta: Kecubung.ParameterMetaData | Kecubung.PropertyMetaData, parent?: string) {
        let result: Core.ValidationError[] = []
        for (let decorator of meta.decorators) {
            if (decorator.name == "type") {
                let validationResult = this.validateModel(value, meta, 
                    parent? `${parent}.${meta.name}` : meta.name)
                if (validationResult) result.push(...validationResult)
            }
            else {
                let validator = this.validators.filter(x => getDecoratorName(x) == decorator.name)[0];
                if (validator) {
                    let errorMessage = validator.validate(value, meta, parent)
                    if (errorMessage) result.push(...errorMessage)
                }
            }
        }
        return result.length > 0 ? result : undefined;
    }

    private validateModel(value, meta: Kecubung.ParameterMetaData | Kecubung.PropertyMetaData, parent?: string) {
        if (!value) return
        let modelName = this.getParameter(meta, 0, "String")
        let modelMetaData = this.metaDataStorage.get(modelName)
        let errors: Core.ValidationError[] = []
        for (let property of modelMetaData.properties) {
            let result = this.validate(value[property.name], property, parent)
            if (result) errors.push(...result)
        }
        return errors.length > 0 ? errors : undefined
    }
}