import { Controller } from "../../../src/controller"
import { Middleware } from "../../../src"
import { val, JsonActionResult } from "../../../src"

let middleware = new Middleware.MiddlewareDecorator()

@middleware.use("UnqualifiedName, path/of/nowhere")
export class UnQualifiedNameOnClassController extends Controller {

    returnView() {
        return this.json("Helow")
    }
}