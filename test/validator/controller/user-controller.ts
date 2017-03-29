import { Controller, ApiController } from "../../../src/controller"
import { UserModel } from "../model/user-model"
import { CategoryModel } from "../model/category-model"
import { val } from "../../../src"

export function otherDecorator() {
    return function (...args) { }
}

export class UserController extends Controller {
    saveUser( @val.type("UserModel, model/user-model") user: UserModel) { }
    noValidator(user) { }
    customDecorator( @otherDecorator() user) { }
    missTypedModel( @val.type("UserModel, not/valid/path") user: UserModel) { }
    nestedError( @val.type("UserModel, model/fail-user-model") user: UserModel) { }
    notSpecifiedClassName( @val.type("") user) { }
    invalidClassName( @val.type("NonValidClassName") user) { }
    primitiveType( @val.type("string") str, @val.type("number") num, @val.type("boolean") bool) { }
    nestedWithArray( @val.type("CategoryModel, model/category-model") category: CategoryModel){}
}