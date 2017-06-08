import { TypeChecker } from "./type-checker"
import * as Mongoose from "mongoose"
import { Core, Resolver } from "kamboja"

export class TypeConverter {
    constructor(private pathResolver: Core.PathResolver, private classes: Core.QualifiedClassMetaData[]) { }

    convert(type: string, typeName: string): any {
        let checker = new TypeChecker(type, this.pathResolver);
        if (!checker.isValid()) throw new Error(`Invalid type used in @val.type in [${typeName}]`)
        let conversion;
        if (checker.isQualifiedName()) {
            let qualifiedName = new Resolver.QualifiedName(type, this.pathResolver)
            let clazz = this.classes.filter(x => qualifiedName.equals(x.qualifiedClassName))[0]
            if (!clazz) throw new Error(`Model [${type}] used in @val.type is not exists in [${typeName}]`)
            let isShortId = clazz.decorators && clazz.decorators.some(x => x.name == "shortid")
            conversion = {
                type: isShortId ? String : Mongoose.Schema.Types.ObjectId,
                ref: checker.getName()
            }
        }
        else if (checker.getName() == "string")
            conversion = String
        else if (checker.getName() == "number")
            conversion = Number
        else if (checker.getName() == "boolean")
            conversion = Boolean
        else
            conversion = Date
        if (checker.isArray()) return [conversion]
        else return conversion
    }
}