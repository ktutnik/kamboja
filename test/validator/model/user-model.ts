import { val } from "../../../src"
import { ItemModel } from "./item-model"
export class UserModel {
    @val.email()
    @val.required()
    @val.type("string")
    email: string

    @val.required()
    displayName: string

    @val.type("ItemModel, model/item-model")
    item: ItemModel
}