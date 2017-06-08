import { val } from "kamboja"
import { mongoose } from "../../../src"

@mongoose.shortid()
export class ShortModel {
    @val.type("string")
    name:string
}

export class DefaultIdModel{
    @val.type("string")
    name:string
}

export class ParentModel {
    @val.type("string")
    name:string

    @val.type("ShortModel, models/models")
    short:ShortModel

    @val.type("DefaultIdModel, models/models")
    defaultId:DefaultIdModel
}