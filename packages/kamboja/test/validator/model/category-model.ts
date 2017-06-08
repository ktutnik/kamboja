import { val } from "../../../src"
import { ItemModel } from "./item-model"

export class CategoryModel {
    @val.required()
    name: string

    @val.type("ItemModel[], model/item-model")
    items: ItemModel[]
}