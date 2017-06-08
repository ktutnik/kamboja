import {val} from "../../../src"

export class ItemModel{
    @val.required()
    name:string

    @val.required()
    barCode:string
}