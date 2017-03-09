import { http, internal } from "../src"
import { Controller, ApiController } from "../src/controller"
import { val } from "../src"

export class MyModel {
    @val.required()
    myProp: string
}

export class MyClass extends Controller {

    getByPage(
        @val.required()
        model) {

    }
}