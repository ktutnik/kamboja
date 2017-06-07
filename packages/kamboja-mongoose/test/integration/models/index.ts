import { val } from "kamboja"
import { Document, Schema } from "mongoose"
import { mongoose } from "../../../src"

export class UserModel {
    @val.type("string")
    email: string

    @val.type("string")
    displayName: string

    @val.type("date")
    dateOfBirth: Date

    @val.type("number")
    rate: number

    @val.type("date")
    createdAt: Date
}

export class CategoryModel {
    @val.type("string")
    name: string
}

export class ItemModel {
    @val.type("string")
    name: string

    @val.type("CategoryModel, models/index")
    category: CategoryModel | Schema.Types.ObjectId

    @val.type("UserModel, models/index")
    createdBy: UserModel | Schema.Types.ObjectId
}

@mongoose.shortid()
export class ProductModel {
    @val.type("string")
    name: string
}

export class ParentProductModel{
    @val.type("string")
    name: string

    @val.type("ProductModel, models/index")
    child:ProductModel
}

export class ParentMultiChildModel{
    @val.type("string")
    name: string

    @val.type("ProductModel[], models/index")
    child:ProductModel[]
}