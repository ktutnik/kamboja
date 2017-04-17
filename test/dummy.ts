import { http, internal } from "../src"
import { Controller, ApiController } from "../src/controller"

export class MyModel {
    myProp: string
}

export class MyController extends Controller {

    @http.get()
    getByPage(model) {}
}