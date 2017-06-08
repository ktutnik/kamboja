import {val} from "../../../src"

export class UserModel{
    @val.email()
    @val.required()
    email:string

    @val.required()
    displayName:string
}