import * as Kecubung from "kecubung"
import { decoratorName, ValidatorBase } from "./baseclasses"
import { ValidationError, MetaDataStorage, FieldValidatorArg } from "../core"
import { QualifiedName } from "../resolver/qualified-name"


const IgnoreTypes = ["string", "number", "boolean"]

export class TypeValidator extends ValidatorBase {
    constructor(private storage: MetaDataStorage) {
        super()
    }

    @decoratorName("type")
    validate(args: FieldValidatorArg): ValidationError[] {
        const FIELD_NAME = args.parentField ? `${args.parentField}.${args.field}` : args.field
        if (this.isEmpty(args.value)) return
        if(!args.decoratorArgs) return;
        let decoratorArg = <Kecubung.PrimitiveValueMetaData>args.decoratorArgs[0]
        if(this.isEmpty(decoratorArg.value)) throw new Error(`Qualified class name should be specified in @val.type in [${args.classInfo.name}]`)
        if(IgnoreTypes.some(x => x == decoratorArg.value.toLowerCase())) return
        let qualified = new QualifiedName(decoratorArg.value);
        if (!qualified.isValid()) throw new Error(`Invalid qualified class name [${decoratorArg.value}] in @val.type decorator in [${args.classInfo.name}]`)
        let clazz = this.storage.get(qualified.qualifiedName)
        if (!clazz) throw new Error(`Class [${decoratorArg.value}] in @val.type is no found in [${args.classInfo.name}]`)
        return this.validateFields({
            type: "PropertiesValidator",
            classInfo: clazz,
            parentField: args.parentField ? `${args.parentField}.${args.field}` : args.field,
            classInstance: args.value
        })
    }
}